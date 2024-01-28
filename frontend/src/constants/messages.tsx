const MESSAGE = {
  ERROR: {
    ADMIN: {
      NONE_ADMIN_UNTIL_NOW: "Nenhum administrador cadastrado até o momento",
      NOT_FOUND: "Admin não encontrado!",
      EMAIL_ERROR: "Por favor, utilize outro email!",
      VERIFY: "Operação não permitida",
      VALIDATION: 'Apenas um usuário com permissões de admin pode registrar outro administrador!'
    },
    CATEGORY: {
      NAME_ALREADY_EXISTS: "Esse nome já existe. Por favor, utilize outro nome!",
      EMPTY_NAME_ERROR: "O  nome da categoria é obrigatório!",
      NOT_FOUND: "Categoria não encontrada!",
      DELETE: "Você tentou excluir uma categoria que não existe"
    },
    ORDER: {
      NONE_ORDER_UNTIL_NOW: "Nenhum pedido cadastrado até o momento",
      NOT_FOUND: "Pedido não encontrado!",
      EMAIL_ERROR: "Email já cadastrado, por favor escolha outro email!"
    },
    PRODUCT: {
      NAME_ALREADY_EXISTS: "Já existe um produto com este nome! Por favor, utilize outro nome!",
      NONE_PRODUCT_UNTIL_NOW: "Nenhum produto cadastrado até o momento",
      NOT_FOUND: "Produto não encontrado!",
      INVALID_ID: "Esse produto não existe no banco de dados do sistema!"
    },
    USER: {
      NONE_USER_UNTIL_NOW: "Nenhum user cadastrado até o momento",
      NOT_FOUND: "Cliente não encontrado!",
      EMAIL_ERROR: "Email já cadastrado! Por favor, utilize outro email!",
      PASS_EMAIL: "Email ou senha inválidos, verifique e tente novamente!",
      PASS_ERROR: "A senha e a confirmação de senha precisam ser iguais!"
    },
    USER_ORDER: {
      NONE_USER_ORDER_UNTIL_NOW: "Nenhum pedido cadastrado até o momento",
      USER_ORDER_NOT_FOUND: "Pedido não encontrado!"
    },
    TOKEN:{
      INVALID: "Token Inválido!"
    },
    ACCESS_DENIED: "Acesso Negado!",
    ERROR_CATCH: "Algo deu errado!",
    UPLOAD_ERROR: "Por favor, envie apenas jpg ou png!",
    NOT_VALID_ID: "Informe um ID válido!"
  },
  SUCCESS: {
    ADMIN: {
      OK: "Admins encontrados com sucesso!",
      FOUNDED: "Admin encontrado com sucesso!",
      SENDING: "Mandando o Admin que foi pedido!",
      CREATED: "Admin criado com sucesso!",
      USER_CREATED: "O usuário agora é um Administrador!",
      UPDATED: "Admin atualizado com sucesso!",
      DELETED: "Admin excluído com sucesso!"
    },
    CATEGORY: {
      CREATED: "Categoria criada com sucesso!",
      UPDATED: "Categoria atualizada com sucesso!",
      DELETED: "Categoria excluída com sucesso!"
    },
    ORDER: {
      FOUND: "Pedido encontrado com sucesso!",
      SENDING: "Enviando o pedido solicitado!",
      CREATED: "Pedido criado com sucesso!",
      UPDATED: "Pedido atualizado com sucesso!",
      DELETED: "Pedido excluído com sucesso!"
    },
    PRODUCT: {
      UPDATED: "Produto atualizado com sucesso!",
      DELETED: " Produto excluído com sucesso!"
    },
    USER: {
      LOGGED: "Você está autenticado!",
      OK: "Usuários encontrados com sucesso!",
      FOUNDED: "Usuário encontrado com sucesso!",
      SENDING: "Mandando o user que foi pedido!",
      CREATED: "Usuário criado com sucesso!",
      UPDATED: "Usuário atualizado com sucesso!",
      DELETED: "Usuário excluído com sucesso!",
      LOGIN: "Usuário logado com sucesso!"
    },
    USER_ORDER: {
      UPDATED: "Pedido atualizado com sucesso!",
      DELETED: "Pedido excluído com sucesso!"
    }
  },
}

export default MESSAGE