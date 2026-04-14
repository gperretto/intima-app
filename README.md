# 🌸 Íntima — Web App

App de áudio erótico feminino. Pronto para hospedar no Vercel.

---

## 📁 Estrutura de arquivos

```
intima-app/
├── index.html          ← página principal
├── vercel.json         ← configuração do Vercel
├── src/
│   ├── style.css       ← todo o estilo
│   └── app.js          ← toda a lógica
└── public/
    └── audio/          ← coloque seus áudios aqui
        ├── intenso_preview.mp3
        ├── poder_preview.mp3
        ├── semfiltro_preview.mp3
        ├── asmr_preview.mp3
        └── diverso_preview.mp3
```

---

## 🎵 Como adicionar os áudios

1. Exporte seus áudios do Audacity em **MP3, 192kbps**
2. Renomeie conforme a lista acima
3. Coloque na pasta `public/audio/`
4. O app detecta automaticamente e usa o áudio real

> Enquanto os arquivos não existem, o player simula a reprodução visualmente.

---

## 🚀 Como hospedar no Vercel (gratuito)

### Opção A — Via GitHub (recomendado)

1. Crie uma conta em [github.com](https://github.com)
2. Crie um repositório novo chamado `intima-app`
3. Faça upload de todos os arquivos desta pasta
4. Acesse [vercel.com](https://vercel.com) e crie uma conta gratuita
5. Clique em **"Add New Project"**
6. Conecte seu GitHub e selecione o repositório `intima-app`
7. Clique em **"Deploy"**
8. Em ~1 minuto o app estará online com uma URL como `intima-app.vercel.app`

### Opção B — Via Vercel CLI

```bash
npm install -g vercel
cd intima-app
vercel
```

---

## 🔗 Onde substituir os links

Abra o `index.html` e procure pelos comentários:

```html
<!-- SUBSTITUA O HREF PELO LINK DA SUA PLATAFORMA -->
<a href="LINK_HOTMART_OU_PRIVACY_AQUI" ...>
```

Substitua pelos links reais da Hotmart ou Privacy após cadastrar os produtos.

Para o personalizado, substitua:
```
https://wa.me/SEU_NUMERO_AQUI
```
Pelo seu WhatsApp no formato internacional: `https://wa.me/5541999999999`

---

## 🎨 Como personalizar

### Trocar o nome do app
No `index.html`, busque `íntima` e substitua pelo nome que escolher.

### Trocar as cores
No `src/style.css`, edite as variáveis no topo:
```css
:root {
  --rose:  #c9637a;   ← cor principal (rosa)
  --gold:  #c4a882;   ← cor dourada
  --text:  #f0ebe8;   ← texto
  --bg:    #0a0808;   ← fundo
}
```

### Trocar os preços
No `index.html`, busque `R$` e atualize os valores.

### Adicionar depoimentos reais
No `index.html`, seção `<!-- DEPOIMENTOS -->`, substitua os textos.

---

## 💰 Plataformas para venda

### Privacy.com.br
- Plataforma brasileira focada em conteúdo adulto
- Aceita PIX, cartão
- Comissão: 20%
- Cadastro: [privacy.com.br](https://privacy.com.br)

### Hotmart
- Plataforma digital completa
- Aceita todos os meios de pagamento
- Comissão: ~9,9% + R$1 por venda
- Cadastro: [hotmart.com](https://hotmart.com)

---

## 📱 Domínio personalizado (opcional)

Após hospedar no Vercel:
1. Compre um domínio em [registro.br](https://registro.br) ou [namecheap.com](https://namecheap.com)
2. No painel do Vercel → Settings → Domains
3. Adicione seu domínio e siga as instruções de DNS

Sugestões de domínio: `intima.app`, `audiointima.com.br`, `ouçaintima.com.br`

---

## 🔒 Verificação de idade (recomendado)

Para adicionar uma tela de verificação de idade antes do site carregar,
entre em contato — posso adicionar essa funcionalidade ao app.

---

Feito com 💜 para o mercado de áudio erótico feminino brasileiro.
