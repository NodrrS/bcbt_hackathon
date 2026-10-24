# Demo QR codes

Open one of these on a laptop screen and point the phone app's scanner at it
(camera scanning needs the app served over **HTTPS** — tunnel or deployed link, see README).

| File | Encodes | What should happen |
|---|---|---|
| [lena-linkedin.png](lena-linkedin.png) | `https://www.linkedin.com/in/lena-hoffmann-demo` | `qr_linkedin` · scripted persona: her demo note gets the full scripted AI result |
| [jonas-xing.png](jonas-xing.png) | `https://www.xing.com/profile/Jonas_Weber_demo` | `qr_xing` · scripted persona |
| [max-linkedin.png](max-linkedin.png) | `https://www.linkedin.com/in/max-mustermann-12ab` | `qr_linkedin` · unscripted: name from slug ("Max Mustermann"), AI goes through the heuristic |
| [vcard-reject-test.png](vcard-reject-test.png) | a vCard (BEGIN:VCARD…) | **rejected** with a friendly message, no row saved — tests the non-URL guard (PRD §2 scan scope) |

Each profile can be scanned only once per event (`contacts_once_per_event`) — reset the demo
or switch events to scan the same code again. Any other URL QR (e.g. your real LinkedIn code)
also works and saves as `qr_other`/`qr_linkedin` accordingly.
