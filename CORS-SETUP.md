# ⚠️ PROBLEMA: CORS não está configurado no backend

## O que está acontecendo?

O navegador está bloqueando as requisições do frontend para o backend porque:
- Frontend roda em: `http://localhost:5173` (Vite)
- Backend roda em: `http://localhost:8080`
- São **origens diferentes** (portas diferentes)
- O backend **não** está respondendo às requisições OPTIONS (preflight CORS)

## Solução: Configure CORS no backend

Dependendo da tecnologia do seu backend, escolha a configuração apropriada:

---

### 🔵 **Spring Boot (Java)**

Crie uma classe de configuração:

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**OU** usando anotação no Controller:

```java
@RestController
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class YourController {
    // seus endpoints
}
```

---

### 🟢 **Node.js / Express**

Instale o pacote cors:
```bash
npm install cors
```

Configure no seu app:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// seus routes...
```

---

### 🔴 **ASP.NET Core (C#)**

No arquivo `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Adicionar serviço CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Usar CORS (ANTES de Authorization e Controllers)
app.UseCors();

app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

### 🟡 **Flask (Python)**

Instale flask-cors:
```bash
pip install flask-cors
```

Configure:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurar CORS
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# suas rotas...
```

---

### 🟣 **FastAPI (Python)**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# suas rotas...
```

---

## Como testar se funcionou?

Após configurar CORS no backend, reinicie o servidor e teste:

### Teste 1: Requisição OPTIONS (preflight)
```powershell
curl http://localhost:8080/login -Method OPTIONS -Headers @{"Origin"="http://localhost:5173"} -UseBasicParsing -Verbose
```

**Deve retornar headers CORS:**
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: ...`

### Teste 2: No navegador
Abra o DevTools (F12) → Aba Console → Execute:
```javascript
fetch('http://localhost:8080/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e))
```

Se funcionar, não vai aparecer erro de CORS!

---

## ⚠️ IMPORTANTE para Produção

Para produção, **NÃO use `*` ou `allowedOrigins("http://localhost:5173")`**.

Troque para o domínio real:
```java
.allowedOrigins("https://seudominio.com.br")
```

---

## Precisa de ajuda?

Me diga qual tecnologia/framework você está usando no backend que eu te ajudo com a configuração específica!
