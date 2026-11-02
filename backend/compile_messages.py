"""
compile_messages.py - Pure Python MO compiler for GNU gettext .po files.
Generates standard binary .mo files without requiring external gettext/msgfmt binaries on Windows.
"""

import os
import sys
import struct
from pathlib import Path

def unescape_po_string(s):
    """
    Unescapes C-style escape sequences in a Unicode string without corrupting UTF-8 characters.
    """
    res = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == '\\' and i + 1 < n:
            nxt = s[i + 1]
            if nxt == 'n':
                res.append('\n')
                i += 2
            elif nxt == 't':
                res.append('\t')
                i += 2
            elif nxt == 'r':
                res.append('\r')
                i += 2
            elif nxt == '"':
                res.append('"')
                i += 2
            elif nxt == '\\':
                res.append('\\')
                i += 2
            else:
                res.append(nxt)
                i += 2
        else:
            res.append(c)
            i += 1
    return "".join(res)

def parse_po_file(po_path):
    """
    Parses a .po file and extracts (msgid, msgstr) pairs.
    """
    with open(po_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    catalog = {}
    current_msgid = None
    current_msgstr = None
    state = None  # 'msgid' or 'msgstr'

    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        if line.startswith('msgid '):
            if current_msgid is not None and current_msgstr is not None:
                catalog[current_msgid] = current_msgstr
            state = 'msgid'
            content = line[6:].strip()
            if content.startswith('"') and content.endswith('"'):
                content = content[1:-1]
            current_msgid = unescape_po_string(content)
            current_msgstr = ""
        elif line.startswith('msgstr '):
            state = 'msgstr'
            content = line[7:].strip()
            if content.startswith('"') and content.endswith('"'):
                content = content[1:-1]
            current_msgstr = unescape_po_string(content)
        elif line.startswith('"') and line.endswith('"'):
            content = line[1:-1]
            unescaped = unescape_po_string(content)
            if state == 'msgid':
                current_msgid += unescaped
            elif state == 'msgstr':
                current_msgstr += unescaped

    if current_msgid is not None and current_msgstr is not None:
        catalog[current_msgid] = current_msgstr

    return catalog


def generate_mo_file(catalog, mo_path):
    """
    Generates a binary GNU MO file from a dictionary of msgid -> msgstr mappings.
    """
    # Keys must be sorted for binary search
    keys = sorted(catalog.keys())
    
    # Kept strings
    msgids = [k.encode('utf-8') for k in keys]
    msgstrs = [catalog[k].encode('utf-8') for k in keys]
    
    num_strings = len(keys)
    
    # 7 32-bit integers in header:
    # 0: magic number (0x950412de)
    # 1: format revision (0)
    # 2: number of strings
    # 3: offset of table with original strings
    # 4: offset of table with translation strings
    # 5: size of hashing table (0)
    # 6: offset of hashing table (0)
    header_size = 7 * 4
    table_size = num_strings * 8  # 2 * 4 bytes per entry (length, offset)
    
    orig_table_offset = header_size
    trans_table_offset = orig_table_offset + table_size
    
    # Strings start right after the translation table
    current_offset = trans_table_offset + table_size
    
    orig_table = []
    trans_table = []
    
    # Calculate offsets for original strings
    data = bytearray()
    for s in msgids:
        orig_table.append((len(s), current_offset))
        data.extend(s)
        data.append(0)  # Null terminator
        current_offset += len(s) + 1
        
    # Calculate offsets for translated strings
    for s in msgstrs:
        trans_table.append((len(s), current_offset))
        data.extend(s)
        data.append(0)  # Null terminator
        current_offset += len(s) + 1

    with open(mo_path, 'wb') as f:
        # Magic number 0x950412de
        f.write(struct.pack('<Iiiiiii', 
                            0x950412de, 
                            0, 
                            num_strings, 
                            orig_table_offset, 
                            trans_table_offset, 
                            0, 
                            0))
        
        # Original string descriptor table
        for length, offset in orig_table:
            f.write(struct.pack('<ii', length, offset))
            
        # Translation string descriptor table
        for length, offset in trans_table:
            f.write(struct.pack('<ii', length, offset))
            
        # Strings data
        f.write(data)


def compile_all(base_dir):
    """
    Finds and compiles all .po files in base_dir, skipping virtual environments.
    """
    count = 0
    for root, dirs, files in os.walk(base_dir):
        # Exclude venv, .git, and node_modules from traversal
        dirs[:] = [d for d in dirs if d not in ('venv', '.git', 'node_modules', '__pycache__')]
        for file in files:
            if file.endswith('.po'):
                po_path = Path(root) / file
                mo_path = po_path.with_suffix('.mo')
                print(f"Compiling: {po_path} -> {mo_path}")
                catalog = parse_po_file(po_path)
                generate_mo_file(catalog, mo_path)
                print(f"  [OK] Successfully compiled {len(catalog)} message strings.")
                count += 1
    return count

if __name__ == '__main__':
    base_dir = Path(__file__).resolve().parent
    print(f"Searching for .po files in {base_dir}...")
    compiled_count = compile_all(base_dir)
    print(f"Done. Compiled {compiled_count} message file(s).")
