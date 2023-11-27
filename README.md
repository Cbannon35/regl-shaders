# regl-shaders

## Generate self-signed certificate

To use https (for browser webcam access) with budo, you need to generate a self-signed certificate. You can do this with the following command:

```bash
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
