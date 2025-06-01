# kfolder

## Instalação

```bash
# 1. Clone o repositório público
git clone https://github.com/seu-usuario/kfolder.git
cd kfolder

# 2. Instale dependências e compile
pnpm install
pnpm run build        # gera ./dist

# 3. Link global (deixa o executável kfolder disponível em todo o sistema)
pnpm link --global
#   └── cria um symlink em ~/.local/share/pnpm/bin (que já deve estar no $PATH do pnpm)

# 4. Use!
kfolder src/inbox-records
cat kfolder.txt       # confirme que o arquivo foi gerado/atualizado
```
