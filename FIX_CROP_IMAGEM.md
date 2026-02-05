# Fix: Problema de Corte na Imagem do Crop

## Problema Identificado
A imagem estava sendo cortada no topo quando carregada no modal de crop, especialmente quando a cabeça da pessoa estava posicionada no topo.

## Causa Raiz
O cálculo de zoom inicial era muito complexo e causava uma imagem muito pequena, além disso, a lógica de transform com divisões por zoom estava criando comportamentos imprevistos.

## Solução Implementada

### 1. Simplificação do Zoom Inicial
**Antes:**
```javascript
const scale = Math.min(400 / img.width, 400 / img.height)
setCropZoom(scale)
```
Este cálculo resultava em zoom muito pequeno (ex: 0.33 para imagens normais)

**Depois:**
```javascript
setCropZoom(1)  // 100% - tamanho natural
```
O usuário pode ajustar com o slider se necessário

### 2. Simplificação do Canvas
**Antes:**
```javascript
ctx.translate(size / 2, size / 2)
ctx.scale(cropZoom, cropZoom)
ctx.translate(-size / 2, -size / 2)
ctx.drawImage(img, -cropPositionX / cropZoom, -cropPositionY / cropZoom)
```
Lógica complexa com múltiplas transformações

**Depois:**
```javascript
const scaledWidth = img.width * cropZoom
const scaledHeight = img.height * cropZoom
ctx.drawImage(img, cropPositionX, cropPositionY, scaledWidth, scaledHeight)
```
Lógica direta e facilmente debugável

### 3. Transform CSS
**Antes:**
```javascript
transform: `scale(${cropZoom}) translate(${cropPositionX / cropZoom}px, ${cropPositionY / cropZoom}px)`
```

**Depois:**
```javascript
transform: `scale(${cropZoom}) translate(${cropPositionX}px, ${cropPositionY}px)`
```
Sem divisões complexas - torna a movimentação mais previsível

## Arquivos Modificados
- `src/pages/AdminAutores.jsx`:
  - Removido estado `imagemDimensoes` (não era necessário)
  - Simplificado `handleImageChange()` 
  - Simplificado `gerarCrop()`
  - Simplificado `cancelCrop()`
  - Transform CSS atualizado

## Comportamento Esperado
1. Usuário carrega imagem
2. Modal abre com imagem em tamanho natural (zoom=1)
3. Se a imagem for maior que 400x400, ela é cortada nas bordas (objectFit: cover)
4. Usuário pode:
   - Arrastar a imagem para reposicionar
   - Usar o slider para aumentar/diminuir zoom
5. Ao clicar "Gerar Crop", a imagem final é cortada em 400x400 quadrado

## Testes Recomendados
- [ ] Carregar imagem com pessoa no topo (deve mostrar sem corte no topo)
- [ ] Carregar imagem retrato (800x1200) e verificar comportamento
- [ ] Carregar imagem paisagem (1200x800) e verificar comportamento
- [ ] Testar zoom com slider e arrastar
- [ ] Verificar imagem final gerada (deve ser 400x400 JPEG)
