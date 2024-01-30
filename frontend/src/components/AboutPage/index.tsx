import styles from './AboutPage.module.scss';

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.text}>
        <div>
          <h1>Livraria Etios</h1>
        </div>
        <div>
          <p>
            Bem-vindo à Livraria Etios, a sua loja virtual dedicada ao mundo dos livros e da leitura. Nós oferecemos uma vasta gama de títulos em diversas categorias para atender às necessidades de leitores apaixonados e ávidos por conhecimento. Na Livraria, acreditamos que a leitura é essencial para o enriquecimento pessoal e o desenvolvimento intelectual. Por isso, oferecemos uma seleção cuidadosamente escolhida de livros de autores renomados e editoras confiáveis, para inspirar, educar e entreter. Entre nossos produtos, você encontrará desde best-sellers e clássicos literários até obras especializadas em áreas como ciência, tecnologia, arte e história. Além disso, também disponibilizamos uma variedade de revistas, quadrinhos e materiais de estudo para complementar sua experiência de leitura e pesquisa.

            Nossa equipe é composta por profissionais experientes e apaixonados por literatura, prontos para ajudá-lo em cada etapa do processo de compra. Estamos sempre à disposição para tirar suas dúvidas, oferecer recomendações e ajudá-lo a encontrar os títulos mais adequados para suas necessidades de leitura. Acreditamos na importância de uma experiência de compra online fácil e segura. Por isso, investimos em tecnologia e segurança para garantir que sua navegação em nosso site seja agradável e seus dados pessoais estejam sempre protegidos.

            Agradecemos por escolher a Livraria como sua loja virtual de livros e materiais de leitura. Estamos ansiosos para ajudá-lo a descobrir novos mundos, ideias e histórias, e conquistar uma vida mais rica e informada.
          </p>
        </div>
      </div>
    </div>
  );
}

