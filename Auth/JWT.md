> WIKI: [JSON Web Encryption](https://en.wikipedia.org/wiki/JSON_Web_Encryption)

> **JSON Web Encryption** (**JWE**) is an [IETF](https://en.wikipedia.org/wiki/IETF) standard providing a standardised syntax for the exchange of encrypted data, based on [JSON](https://en.wikipedia.org/wiki/JSON) and [Base64](https://en.wikipedia.org/wiki/Base64).[[1\]](https://en.wikipedia.org/wiki/JSON_Web_Encryption#cite_note-Keung2018-1) It is defined by [RFC](https://en.wikipedia.org/wiki/RFC_(identifier)) [7516](https://datatracker.ietf.org/doc/html/rfc7516). 
>
> *Along with [JSON Web Signature](https://en.wikipedia.org/wiki/JSON_Web_Signature) (JWS), it is one of the two possible formats of a JWT ([JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token))*
>
> JWE 和 JWS 是 JWT 的两种格式



## [JSON Web Signature (JWS)](https://self-issued.info/docs/draft-ietf-jose-json-web-signature.html)

 JWS 是一种标准，用于生成具有签名的 JSON 对象。它可以确保数据的完整性和真实性。

- **头部 (Header)**: 包含签名算法等元数据。
- **已签名的内容 (Payload)**: 通常是经过编码的 JSON 对象，包含实际要传输的数据。
- **签名 (Signature)**: 使用指定的算法对头部和已签名内容进行计算得到的结果。



## [JSON Web Encryption（JWE）](https://www.rfc-editor.org/rfc/rfc7516)

同样是一种标准

- **头部 (Header)**: 包含加密算法和加密方法的信息。
- **加密的内容 (Encrypted Content)**: 加密后的实际数据。
- **初始向量 (Initialization Vector)**: 在某些加密模式中使用，用于增加安全性。
- **加密密钥封装 (Encrypted Key)**: 如果使用非对称密钥，则发送方会用接收方的公钥加密对称密钥。
- **认证标签 (Authentication Tag)**: 用于完整性验证。

```
header.encryptedKey.initializationVector.ciphertext.authenticationTag
```



## JWS    VS    JWE

### JWS 和 JWE 的区别

- 目的不同:
  - JWS 主要用于验证数据的**完整性和来源**。
  - JWE 主要用于保护数据的**隐私性**，即确保数据在传输过程中的机密性。
- 结构不同:
  - JWS 通常由三部分组成（头部、已签名的内容、签名）。
  - JWE 通常由五部分组成（头部、加密的内容、初始向量、加密密钥封装、认证标签）。
- 应用场景不同:
  - JWS 常用于身份验证场景，例如 OAuth 授权流程。
  - JWE 常用于需要加密保护数据的应用场景，例如在客户端与服务器之间传输敏感信息。



## JSON Web Token (JWT)

> 详细资料 https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

- Header（头部）
- Payload（负载）
- Signature（签名）

```
Header.Payload.Signature
```

### Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload 

- iss (issuer)：签发人
- exp (expiration time)：过期时间
- sub (subject)：主题
- aud (audience)：受众
- nbf (Not Before)：生效时间
- iat (Issued At)：**签发时间**
- jti (JWT ID)：编号



> Header 和 Payload 需要用 Base64URL 算法转成字符串
>
> JWT 作为一个令牌（token），有些场合**可能会放到 URL**（比如 api.example.com/?token=xxx）。Base64 有**三个字符`+`、`/`和`=`，在 URL 里面有特殊含义**，所以要被替换掉：**`=`被省略、`+`替换成`-`，`/`替换成`_`** 。这就是 Base64URL 算法。

### Signature

首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

> ```javascript
> HMACSHA256(
>   base64UrlEncode(header) + "." +
>   base64UrlEncode(payload),
>   secret)
> ```

### 使用

前端存储在本地，例如 `localStorage` 中，在请求头中如下使用：

```javascript
Authorization: Bearer <token>
```

### 验签

将JWT的 `header` 和 `payload` 部分使用对应的加密算法和密钥 (secret) 重新加密一次，然后验证 `signature` 是否一致

> 注：服务器每次收到请求都要进行验证

### 签名过期

- 重定向用户到登录页面重新获取 JWT
- 前端通过接口重新获取新 Token

### 特点

（1）JWT **默认是不加密**，但也是可以加密的。**生成原始 Token 以后，可以用密钥再加密一次**。

（2）JWT 不加密的情况下，不能将秘密数据写入 JWT。

（3）JWT **不仅可以用于认证，也可以用于交换信息**。有效使用 JWT，可以降低服务器查询数据库的次数。

（4）JWT 的**最大缺点**是，由于**服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限**。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

（5）JWT 本身包含了认证信息，**一旦泄露，任何人都可以获得该令牌的所有权限**。为了减少盗用，JWT 的**有效期应该设置得比较短**。对于一些比较重要的权限，使用时应该再次对用户进行认证。

（6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，**要使用 HTTPS 协议传输**。

