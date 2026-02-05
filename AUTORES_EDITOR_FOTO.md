# 📸 Editor de Posicionamento de Foto - Guia

## ✨ Nova Funcionalidade

Foi adicionado um editor visual para **posicionar e enquadrar a foto do autor** antes de salvar. Agora você pode:

- ✅ Fazer zoom in/out na imagem
- ✅ Arrastar a imagem para enquadrar o rosto
- ✅ Ver preview em tempo real
- ✅ Grade de referência para melhor posicionamento
- ✅ Salvar imagem enquadrada

---

## 🎯 Como Usar

### 1️⃣ Carregar Imagem

No painel de autores (`/admin/autores`):

```
1. Clique em "Selecionar arquivo"
2. Ou cole a imagem com Ctrl+V
3. Modal de posicionamento abre automaticamente
```

### 2️⃣ Posicionar a Foto

No modal de crop:

**Arrastar a Imagem:**
- Clique e arraste com o mouse
- A imagem se move dentro do quadrado
- O quadrado delimita o enquadre final

**Ajustar Zoom:**
- Use o controle deslizante (slider)
- Mínimo: 50%
- Máximo: 300%
- Veja o percentual em tempo real

### 3️⃣ Confirmar

- Clique em **"Confirmar"** para salvar
- A imagem enquadrada aparece no preview
- Ou **"Cancelar"** para desconsiderar as mudanças

---

## 🖼️ Interface do Editor

```
┌────────────────────────────────────────────┐
│  Posicionar Foto                       [✕] │
├────────────────────────────────────────────┤
│                                            │
│  Arraste a imagem para posicionar...       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │     [Imagem com Grade de Ref.]       │  │
│  │     (Arraste para mover)             │  │
│  │     (Clique para enquadrar)          │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Zoom: 100%                                │
│  [−] ▓▓▓▓░░░░░░░░░░ [+]                   │
│                                            │
│  ℹ️ Dica: Centralize o rosto no quadrado  │
│                                            │
│  [Cancelar]  [Confirmar]                   │
└────────────────────────────────────────────┘
```

---

## 🎨 Características Técnicas

### Zoom
- **Mínimo**: 50% (imagem inteira visível)
- **Máximo**: 300% (zoom bem próximo)
- **Incremento**: 0,1 (ajuste suave)
- **Display**: Mostra percentual em tempo real

### Arrastar (Drag)
- Click and drag com o mouse
- Suporta movimento livre em X e Y
- Cursor muda para indicar modo arrasto
- Preview em tempo real

### Grid de Referência
- Linhas 1/3-2/3 (regra dos terços)
- Ajuda no posicionamento do rosto
- Semitransparente (não bloqueia visão)

### Tamanho de Saída
- **Formato**: Quadrado 400x400px
- **Qualidade**: JPEG 90%
- **Proporção**: 1:1 (perfeito para avatares)

---

## 💡 Dicas de Uso

### Melhor Posicionamento
1. Posicione o rosto no **centro do quadrado**
2. Use o **grid de referência** como guia
3. Deixe um pouco de espaço ao redor do rosto
4. Evite cortar partes importantes

### Exemplos Bons
```
✅ Rosto centralizado
✅ Olhos alinhados com a linha superior
✅ Queixo próximo à linha inferior
✅ Espaço equilibrado dos lados
```

### Exemplos Ruins
```
❌ Rosto muito próximo da borda
❌ Cabeça cortada
❌ Desalinhado demais
❌ Muito zoom ou muito pequeno
```

---

## 🔄 Fluxo Completo

```
1. Admin clica "Selecionar arquivo"
   ↓
2. Escolhe imagem do computador
   ↓
3. Modal de crop abre automaticamente
   ↓
4. Admin arrasta e ajusta zoom
   ↓
5. Visualiza resultado em tempo real
   ↓
6. Clica "Confirmar"
   ↓
7. Imagem enquadrada aparece no preview
   ↓
8. Admin clica "Criar" ou "Atualizar"
   ↓
9. Autor salvo com foto enquadrada
```

---

## 🎬 Casos de Uso

### Foto de Perfil
```
- Rosto centralizado
- Zoom para enquadrar apenas o rosto
- Resultado: Avatar profissional
```

### Foto com Fundo
```
- Posicione o corpo inteiro
- Ajuste zoom para incluir tudo
- Resultado: Foto profissional completa
```

### Foto Genérica
```
- Centralize o elemento principal
- Mantenha equilíbrio visual
- Resultado: Imagem harmoniosa
```

---

## 📱 Responsividade

- ✅ Modal adaptável em dispositivos pequenos
- ✅ Controles acessíveis em mobile
- ✅ Arrasto funciona em touch/mouse
- ✅ Máximo 90vh de altura (deixa espaço)

---

## 🔧 Especificações Técnicas

### Canvas
- Tamanho: 400x400px (quadrado)
- Formato: JPEG
- Qualidade: 90% (balanceamento tamanho/qualidade)
- Conversão: Base64 (armazenado no BD)

### Transformações
- `transform: scale()` - Zoom
- `transform: translate()` - Posição X/Y
- GPU-accelerated (smooth performance)

### Validação
- Apenas imagens aceitas
- Tipo validado (`image/*`)
- Tamanho do arquivo: sem limite (será comprimido)

---

## ⚠️ Limitações

- ❌ Sem rotação (apenas zoom + arrasto)
- ❌ Sem filtros (apenas crop)
- ❌ Sem seleção de formato (sempre quadrado)

**Nota**: Para funcionalidades avançadas como rotação, considere integrar uma biblioteca como `react-easy-crop` ou `react-image-crop` no futuro.

---

## 🎯 Melhorias Futuras (Opcional)

- [ ] Rotação de imagem
- [ ] Filtros (brightness, contrast, etc)
- [ ] Múltiplos formatos (quadrado, retangular, etc)
- [ ] Histórico de crops (undo/redo)
- [ ] Presets de tamanho (diferentes proporções)
- [ ] Suporte a touch gestures (pinch to zoom)

---

## 📝 Exemplo Prático

### Cenário: Adicionar foto de novo autor

```
1. Acesse /admin/autores
2. Clique "Selecionar arquivo"
3. Escolha foto_joao.jpg
4. Modal abre com a foto
5. Arraste para centrar o rosto
6. Ajuste zoom se necessário
7. Clique "Confirmar"
8. Preview mostra foto enquadrada
9. Preencha Nome: "João Silva"
10. Preencha Cargo: "Designer Gráfico"
11. Clique "Criar"
12. ✅ Autor criado com foto enquadrada!
```

---

## 🐛 Troubleshooting

### Modal não abre
- Verifique se selecionou uma imagem válida
- Tente outro formato (PNG em vez de JPG)

### Arrastar não funciona
- Certifique-se de clicar dentro da área cinza
- Tente com o botão esquerdo do mouse

### Zoom não muda
- Use o slider, não a roda do mouse
- Verifique se está no range 50-300%

### Imagem fica pixelada
- Reduza o zoom para a imagem original
- Use imagens de alta resolução

---

## 📞 Suporte

Para problemas, consulte:
- `AUTORES_GUIA.md` - Documentação geral
- `AUTORES_TESTE_RAPIDO.md` - Testes de funcionalidade
- Console do navegador (F12) para erros técnicos

---

**Aproveite o novo editor de fotos!** 📸✨
