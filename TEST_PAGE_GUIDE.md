# Guia - Página de Teste do Dashboard

## 📋 Descrição

A página de teste foi criada para validar quais entidades do banco de dados estão acessíveis através da API do Strapi e verificar a estrutura dos dados retornados.

## 🚀 Como Acessar

1. **URL**: `http://localhost:3001/teste`
2. **Menu**: Clique no link "Teste" no menu de navegação do dashboard

## 📊 O Que A Página Faz

A página de teste:
1. Busca uma amostra (1 registro) de cada entidade do banco de dados
2. Exibe o JSON com os dados retornados
3. Valida quais campos estão presentes em cada entidade
4. Mostra indicadores visuais (✓ encontrado, ✗ não encontrado)
5. Exibe erros de endpoints que não conseguiu acessar

## 📦 Entidades Testadas

1. **👤 USUÁRIOS** (`/users`)
   - Campos esperados: id, username, email, firstname, lastname, sex, created_at

2. **🥾 TRILHAS** (`/trails`)
   - Campos esperados: id, name, description, distance, difficulty, trechos

3. **🗺️ ROTAS DE TRILHAS** (`/trail-routes`)
   - Campos esperados: id, name, trail, trecho, coordinates, distance

4. **🛤️ TRECHOS** (`/trail-parts`)
   - Campos esperados: id, name, trail, distance, duration, coordinates

5. **📍 CHECKPOINTS** (`/checkpoints`)
   - Campos esperados: id, name, trail_part, coordinates, description

6. **🏪 ESTABELECIMENTOS** (`/establishments`)
   - Campos esperados: id, name, type, coordinates, phone, email

7. **🎓 CERTIFICADOS** (`/certificates`)
   - Campos esperados: id, user, trail, issued_at, issued_by

8. **👥 PAPÉIS/ROLES** (`/users-permissions/roles`)
   - Campos esperados: id, name, description, type, permissions

9. **🔒 PERMISSÕES** (`/users-permissions/permissions`)
   - Campos esperados: id, type, controller, action, enabled, policy

## 🎨 Estrutura Visual

- **Cabeçalho**: Exibe título e data/hora de carregamento
- **Seção de Erros**: Mostra endpoints que retornaram erro (ex: 403 Forbidden)
- **DataBlocks**: Cada entidade tem seu próprio bloco contendo:
  - Título com emoji e nome da entidade
  - JSON formatado com os dados retornados
  - Lista de campos esperados com indicadores de presença

## ⚙️ Configuração

### Backend (Strapi)
```bash
cd d:\CoraApp\caminho-de-cora-backend\app
npm run develop
# Será acessível em http://localhost:1337
```

### Frontend (Vite)
```bash
cd d:\CoraApp\cora-dashboards
npm run dev
# Será acessível em http://localhost:3001
```

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos:
1. **`src/services/testDatabaseAPI.js`**
   - Função: `fetchTestData()` - busca dados de todas as 9 entidades
   - Implementa error handling gracioso para endpoints indisponíveis

2. **`src/components/TestPage/TestPage.jsx`**
   - Componente React que renderiza os dados testados
   - Estados: loading, data, errors
   - Hook useEffect para buscar dados ao montar

3. **`src/components/TestPage/TestPage.css`**
   - Estilos para a página de teste
   - Layout responsivo com grid
   - Cores para indicadores de campos (verde = encontrado, vermelho = não encontrado)

### Arquivos Modificados:
1. **`src/App.jsx`**
   - Importada novo componente TestPage
   - Adicionada rota `/teste`
   - Adicionado link "Teste" no menu de navegação

## 📊 Exemplo de Resposta Esperada

```json
{
  "users": {
    "id": 1,
    "username": "peregrino1",
    "email": "user@example.com",
    "firstname": "João",
    "lastname": "Silva",
    "sex": "male",
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  "trails": {
    "id": 1,
    "name": "Caminho da Gruta",
    "description": "Trilha histórica...",
    "distance": 25.5,
    "difficulty": "medium"
  },
  // ... mais entidades
  "errors": [
    "Trail-Parts retornou 403: Forbidden",
    // ... outros erros
  ]
}
```

## 🐛 Problemas Conhecidos

### 1. Trail-Parts (403 Forbidden)
**Problema**: Endpoint `/trail-parts` retorna erro 403 (Forbidden)
**Causa**: Restrição de permissões no Strapi
**Solução**: Verificar permissões de role no painel administrativo do Strapi

### 2. Endpoints Não Testados
**Problema**: Alguns endpoints podem não ter dados ou permissões
**Como Verificar**: Acessar a página de teste e verificar a seção "Erros"
**Solução**: Ajustar permissões no Strapi admin ou criar dados para testes

## 🔍 Como Debugar

1. **Abra o DevTools** (F12 no navegador)
2. **Vá para a aba Console** para ver erros de requisição
3. **Vá para a aba Network** para ver status das requisições HTTP
4. **Procure por requisições com status 4xx ou 5xx**

### Requisições Esperadas:
- GET http://localhost:1337/users
- GET http://localhost:1337/trails
- GET http://localhost:1337/trail-routes
- GET http://localhost:1337/trail-parts
- GET http://localhost:1337/checkpoints
- GET http://localhost:1337/establishments
- GET http://localhost:1337/certificates
- GET http://localhost:1337/users-permissions/roles
- GET http://localhost:1337/users-permissions/permissions

## 📝 Próximos Passos

1. ✅ Executar a página de teste
2. ⏳ Verificar quais endpoints retornam dados
3. ⏳ Documentar estrutura de dados de cada entidade
4. ⏳ Ajustar permissões no Strapi para endpoints com 403
5. ⏳ Atualizar publicDashboardAPI.js com as entidades acessíveis
6. ⏳ Integrar dados reais nos dashboards

## 💡 Dicas

- A página faz cache do resultado, recarregue a página (F5) para atualizar os dados
- Os dados são buscados ao carregar a página, não há auto-refresh
- A página é pública e pode ser acessada sem autenticação
- Use a seção de erro para identificar problemas de acesso à API

---

**Criado em**: 2026-01-31
**Versão**: 1.0
**Status**: ✅ Pronto para uso
