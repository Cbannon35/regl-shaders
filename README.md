# regl-shaders

## Generate self-signed certificate

I had issues with browser webcam permissions, so you may need to generate a self-signed certificate. I created a <code>rsa/</code> folder at the root and put in my certificate and key:

```bash
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
