# Certificate Forger :closed_book:
Command line tool for easily creating self-signed RSA certificates using the [`node-forge`](https://www.npmjs.com/package/node-forge) module. 

## Installation :zap:
- The tool can be installed globally throught npm, then use `cforge` to access it:
```console
npm install -g certificate-forger
cforge --help
```
- It can also be installed locally in your module, you can then use `npx` to create certificates:
```console
npm install certificate-forger
npx cforge --help
```

## Certificate Creation :scroll:
### Using the tool :hammer:
The tool uses [`node-forge`](https://www.npmjs.com/package/node-forge) module to create a RSA keypair of the chosen size and  a new certificate with the provided attributes and alternative options (if enabled). To use the tool execute the `cforge` command ans choose the options to enable:
```console
> cforge --help OR npx cforge --help
Usage: cforge [options]

Generate X.509 PEM certificates using node-forge

Options:
  -V, --version  output the version number
  -a,--alt       Enable alternatives option (default: false)
  -o,--out       Output certificate to file (default: false)
  -h, --help     display help for command
```
### Key-Size :old_key:
The tool provides `1024`, `2048`, `4096`, `8192` key size options for the RSA keypair generation.

## Options :gear:
### Exporting to PEM files :open_file_folder:
Adding the `-o` or `--out` option will enable the prompr for providing an output directory location for storing the generated certificate, by default point to a `certificate` folder in the current working directory:
```console
> cforge -o
✔ RSA Modulus Size › 2048
✔ Certificate Attibutes: (commonName=example.com) … CN=example.com, OU=Test
✔ Add more attributes? … yes
✔ Certificate Attibutes: (commonName=example.com) … *SU=Test
√ Output Location: ... /home/doth/certificates
...
```
The certificate and private key can be found in the chose location as shown below:
```console
> ls ./certificates
cert.pem   pkey.pem
> cat ./certificates/cert.pem
-----BEGIN CERTIFICATE-----
MIIC3TCCAcWgAwIBAgIUASa8LJwe4krRfHlQOHmvNzQB4fQwDQYJKoZIhvcNAQEF
BQAwITESMBAGAQATC2V4YW1wbGUuY29tMQswCQYBABMEVGVzdDAeFw0yMzA0MjMy
MzQ2NDhaFw0yMzA0MjQyMzQ2NDhaMCExEjAQBgEAEwtleGFtcGxlLmNvbTELMAkG
...
```

### Adding Alternative IPs & URIs :link:
If you add the `-a` or `--alt` option, the tool will prompt for alternative IPs and URIs to add to the certificate. Both inputs can take multiple arguments using `,` as the seperator:
```console
> cforge -a
...
√ Alternative IPs: ... 172.16.1.1, 172.16.1.2
√ Alternative URIs: ... http://server.com 
...
```

### Adding OID Attributes :wrench:
Certificate attributes must be in the format `<name/*ShortName>=<value>` *(Use the `*` to add a ShortName identifier for the attribute instead of name)*.
When adding attributes to the certificate, they should correspond to existing OIDs defined in the `node-forge` module, below is a list of the [Object IDentifiers](https://en.wikipedia.org/wiki/Object_identifier) available to provide as attributes for the certificate:
```js
    commonName: '2.5.4.3',
    surname: '2.5.4.4',
    serialNumber: '2.5.4.5',
    countryName: '2.5.4.6',
    localityName: '2.5.4.7',
    stateOrProvinceName: '2.5.4.8',
    streetAddress: '2.5.4.9',
    organizationName: '2.5.4.10',
    organizationalUnitName: '2.5.4.11',
    title: '2.5.4.12',
    description: '2.5.4.13',
    businessCategory: '2.5.4.15',
    postalCode: '2.5.4.17',
    givenName: '2.5.4.42',
    rsaEncryption: '1.2.840.113549.1.1.1',
    md5WithRSAEncryption: '1.2.840.113549.1.1.4',
    sha1WithRSAEncryption: '1.2.840.113549.1.1.5',
    'RSAES-OAEP': '1.2.840.113549.1.1.7',
    mgf1: '1.2.840.113549.1.1.8',
    pSpecified: '1.2.840.113549.1.1.9',
    'RSASSA-PSS': '1.2.840.113549.1.1.10',
    sha256WithRSAEncryption: '1.2.840.113549.1.1.11',
    sha384WithRSAEncryption: '1.2.840.113549.1.1.12',
    sha512WithRSAEncryption: '1.2.840.113549.1.1.13',
    EdDSA25519: '1.3.101.112',
    'dsa-with-sha1': '1.2.840.10040.4.3',
    desCBC: '1.3.14.3.2.7',
    sha1: '1.3.14.3.2.26',
    sha1WithRSASignature: '1.3.14.3.2.29',
    sha256: '2.16.840.1.101.3.4.2.1',
    sha384: '2.16.840.1.101.3.4.2.2',
    sha512: '2.16.840.1.101.3.4.2.3',
    sha224: '2.16.840.1.101.3.4.2.4',
    'sha512-224': '2.16.840.1.101.3.4.2.5',
    'sha512-256': '2.16.840.1.101.3.4.2.6',
    md2: '1.2.840.113549.2.2',
    md5: '1.2.840.113549.2.5',
    data: '1.2.840.113549.1.7.1',
    signedData: '1.2.840.113549.1.7.2',
    envelopedData: '1.2.840.113549.1.7.3',
    signedAndEnvelopedData: '1.2.840.113549.1.7.4',
    digestedData: '1.2.840.113549.1.7.5',
    encryptedData: '1.2.840.113549.1.7.6',
    emailAddress: '1.2.840.113549.1.9.1',
    unstructuredName: '1.2.840.113549.1.9.2',
    contentType: '1.2.840.113549.1.9.3',
    messageDigest: '1.2.840.113549.1.9.4',
    signingTime: '1.2.840.113549.1.9.5',
    counterSignature: '1.2.840.113549.1.9.6',
    challengePassword: '1.2.840.113549.1.9.7',
    unstructuredAddress: '1.2.840.113549.1.9.8',
    extensionRequest: '1.2.840.113549.1.9.14',
    friendlyName: '1.2.840.113549.1.9.20',
    localKeyId: '1.2.840.113549.1.9.21',
    x509Certificate: '1.2.840.113549.1.9.22.1',
    keyBag: '1.2.840.113549.1.12.10.1.1',
    pkcs8ShroudedKeyBag: '1.2.840.113549.1.12.10.1.2',
    certBag: '1.2.840.113549.1.12.10.1.3',
    crlBag: '1.2.840.113549.1.12.10.1.4',
    secretBag: '1.2.840.113549.1.12.10.1.5',
    safeContentsBag: '1.2.840.113549.1.12.10.1.6',
    pkcs5PBES2: '1.2.840.113549.1.5.13',
    pkcs5PBKDF2: '1.2.840.113549.1.5.12',
    pbeWithSHAAnd128BitRC4: '1.2.840.113549.1.12.1.1',
    pbeWithSHAAnd40BitRC4: '1.2.840.113549.1.12.1.2',
    'pbeWithSHAAnd3-KeyTripleDES-CBC': '1.2.840.113549.1.12.1.3',
    'pbeWithSHAAnd2-KeyTripleDES-CBC': '1.2.840.113549.1.12.1.4',
    'pbeWithSHAAnd128BitRC2-CBC': '1.2.840.113549.1.12.1.5',
    'pbewithSHAAnd40BitRC2-CBC': '1.2.840.113549.1.12.1.6',
    hmacWithSHA1: '1.2.840.113549.2.7',
    hmacWithSHA224: '1.2.840.113549.2.8',
    hmacWithSHA256: '1.2.840.113549.2.9',
    hmacWithSHA384: '1.2.840.113549.2.10',
    hmacWithSHA512: '1.2.840.113549.2.11',
    'des-EDE3-CBC': '1.2.840.113549.3.7',
    'aes128-CBC': '2.16.840.1.101.3.4.1.2',
    'aes192-CBC': '2.16.840.1.101.3.4.1.22',
    'aes256-CBC': '2.16.840.1.101.3.4.1.42',
    jurisdictionOfIncorporationStateOrProvinceName: '1.3.6.1.4.1.311.60.2.1.2',
    jurisdictionOfIncorporationCountryName: '1.3.6.1.4.1.311.60.2.1.3',
    nsCertType: '2.16.840.1.113730.1.1',
    nsComment: '2.16.840.1.113730.1.13',
    '2.5.29.1': 'authorityKeyIdentifier',
    '2.5.29.2': 'keyAttributes',
    '2.5.29.3': 'certificatePolicies',
    '2.5.29.4': 'keyUsageRestriction',
    '2.5.29.5': 'policyMapping',
    '2.5.29.6': 'subtreesConstraint',
    '2.5.29.7': 'subjectAltName',
    '2.5.29.8': 'issuerAltName',
    '2.5.29.9': 'subjectDirectoryAttributes',
    '2.5.29.10': 'basicConstraints',
    '2.5.29.11': 'nameConstraints',
    '2.5.29.12': 'policyConstraints',
    '2.5.29.13': 'basicConstraints',
    subjectKeyIdentifier: '2.5.29.14',
    keyUsage: '2.5.29.15',
    subjectAltName: '2.5.29.17',
    issuerAltName: '2.5.29.18',
    basicConstraints: '2.5.29.19',
    '2.5.29.20': 'cRLNumber',
    '2.5.29.21': 'cRLReason',
    '2.5.29.22': 'expirationDate',
    '2.5.29.23': 'instructionCode',
    '2.5.29.24': 'invalidityDate',
    '2.5.29.25': 'cRLDistributionPoints',
    '2.5.29.26': 'issuingDistributionPoint',
    '2.5.29.27': 'deltaCRLIndicator',
    '2.5.29.28': 'issuingDistributionPoint',
    '2.5.29.29': 'certificateIssuer',
    '2.5.29.30': 'nameConstraints',
    cRLDistributionPoints: '2.5.29.31',
    certificatePolicies: '2.5.29.32',
    '2.5.29.33': 'policyMappings',
    '2.5.29.34': 'policyConstraints',
    authorityKeyIdentifier: '2.5.29.35',
    '2.5.29.36': 'policyConstraints',
    extKeyUsage: '2.5.29.37',
    '2.5.29.46': 'freshestCRL',
    '2.5.29.54': 'inhibitAnyPolicy',
    timestampList: '1.3.6.1.4.1.11129.2.4.2',
    authorityInfoAccess: '1.3.6.1.5.5.7.1.1',
    serverAuth: '1.3.6.1.5.5.7.3.1',
    clientAuth: '1.3.6.1.5.5.7.3.2',
    codeSigning: '1.3.6.1.5.5.7.3.3',
    emailProtection: '1.3.6.1.5.5.7.3.4',
    timeStamping: '1.3.6.1.5.5.7.3.8'
```