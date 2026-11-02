"""
test_i18n.py - Automated verification of English <-> Kannada language switching.
"""
import os
import sys
import django

# Ensure stdout handles UTF-8 characters on Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
    sys.stderr.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agri_mart_backend.settings')
django.setup()

from django.utils import translation
from django.utils.translation import gettext as _
from django.test import Client

def run_tests():
    print("=" * 60)
    print("Running Agri-MART Language Switching Verification")
    print("=" * 60)

    # Test 1: Direct translation lookup for English
    translation.activate('en')
    en_msg = _("Welcome to Agri-MART")
    print(f"\n[Test 1] English Translation:")
    print(f"  Expected: 'Welcome to Agri-MART'")
    print(f"  Got:      '{en_msg}'")
    assert en_msg == "Welcome to Agri-MART", f"English failed: got {en_msg}"
    print("  => PASSED [OK]")

    # Test 2: Direct translation lookup for Kannada
    translation.activate('kn')
    kn_msg = _("Welcome to Agri-MART")
    print(f"\n[Test 2] Kannada Translation:")
    print(f"  Expected: 'ಅಗ್ರಿ-ಮಾರ್ಟ್‌ಗೆ ಸ್ವಾಗತ'")
    print(f"  Got:      '{kn_msg}'")
    assert kn_msg == "ಅಗ್ರಿ-ಮಾರ್ಟ್‌ಗೆ ಸ್ವಾಗತ", f"Kannada failed: got {kn_msg}"
    print("  => PASSED [OK]")

    # Test 3: Multiple Kannada translation checks
    checks = [
        ("Crop Recommendation", "ಬೆಳೆ ಶಿಫಾರಸು"),
        ("Disease Detection", "ರೋಗ ಪತ್ತೆ"),
        ("Yield Prediction", "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ"),
        ("Live Mandi Rates", "ನೇರ ಮಂಡಿ ದರಗಳು"),
        ("Smart Agriculture Powered by AI", "ಎಐ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ"),
    ]
    print("\n[Test 3] Multiple String Kannada Translations:")
    for en_str, exp_kn in checks:
        got_kn = _(en_str)
        print(f"  '{en_str}' -> '{got_kn}'")
        assert got_kn == exp_kn, f"Failed for '{en_str}': expected '{exp_kn}', got '{got_kn}'"
    print("  => ALL PASSED [OK]")

    # Test 4: Full HTTP Client flow (GET English -> POST setlang to kn -> GET Kannada)
    client = Client()

    # Step 4a: Default GET
    resp_en = client.get('/')
    print(f"\n[Test 4a] GET / (Default English): Status={resp_en.status_code}")
    assert resp_en.status_code == 200, f"Expected 200, got {resp_en.status_code}"
    content_en = resp_en.content.decode('utf-8')
    assert "Welcome to Agri-MART" in content_en, "English welcome message not found in HTML"
    assert "Crop Recommendation" in content_en, "English feature title not found in HTML"
    print("  => English template rendered successfully [OK]")

    # Step 4b: POST /i18n/setlang/ to switch to Kannada
    resp_switch = client.post('/i18n/setlang/', data={'language': 'kn', 'next': '/'})
    print(f"\n[Test 4b] POST /i18n/setlang/ with language=kn: Status={resp_switch.status_code}")
    assert resp_switch.status_code == 302, f"Expected 302 redirect, got {resp_switch.status_code}"
    assert client.cookies.get('django_language').value == 'kn', "django_language cookie was not set to 'kn'"
    print(f"  => Set-Cookie: django_language={client.cookies.get('django_language').value} [OK]")

    # Step 4c: GET / after switching to Kannada
    resp_kn = client.get('/')
    print(f"\n[Test 4c] GET / with Kannada cookie: Status={resp_kn.status_code}")
    assert resp_kn.status_code == 200, f"Expected 200, got {resp_kn.status_code}"
    content_kn = resp_kn.content.decode('utf-8')
    assert "ಅಗ್ರಿ-ಮಾರ್ಟ್‌ಗೆ ಸ್ವಾಗತ" in content_kn, "Kannada welcome message not found in HTML"
    assert "ಬೆಳೆ ಶಿಫಾರಸು" in content_kn, "Kannada 'Crop Recommendation' not found in HTML"
    assert "ರೋಗ ಪತ್ತೆ" in content_kn, "Kannada 'Disease Detection' not found in HTML"
    assert "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ" in content_kn, "Kannada 'Yield Prediction' not found in HTML"
    assert "ನೇರ ಮಂಡಿ ದರಗಳು" in content_kn, "Kannada 'Live Mandi Rates' not found in HTML"
    print("  => Kannada template rendered with full translations [OK]")

    # Step 4d: Switch back to English
    resp_switch_back = client.post('/i18n/setlang/', data={'language': 'en', 'next': '/'})
    assert resp_switch_back.status_code == 302
    assert client.cookies.get('django_language').value == 'en'
    resp_en2 = client.get('/')
    content_en2 = resp_en2.content.decode('utf-8')
    assert "Welcome to Agri-MART" in content_en2
    print("\n[Test 4d] Switched back to English successfully [OK]")

    print("\n" + "=" * 60)
    print("ALL LANGUAGE SWITCHING TESTS PASSED SUCCESSFULLY! [OK]")
    print("=" * 60)

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(f"\n[ERROR] Test failed: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
