import DOMPurify from 'dompurify';

const signUpDocumentData = {
	privacyPolicy: {
		title: 'Política de Privacidade da VENDA+ Agromarket Brasil',
		description:
			'Termo de Consentimento de Privacidade - VENDA+ Agromarket Brasil',
		content: `
			<p>
				Ao prosseguir com o cadastro na plataforma VENDA+ Agromarket Brasil,
				operada pela VENDAMAIS AGROMARKET BRASIL INOVA SIMPLES (I.S.) (CNPJ:
				62.591.442/0001-07), você declara estar ciente e concordar
				expressamente com os termos desta Política de Privacidade, que
				descreve como coletamos, usamos, armazenamos e protegemos os seus
				dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
				(Lei nº 13.709/2018-LGPD).
			</p>

			<h2 style='font-weight: 600;'>1. Dados Coletados e Finalidade</h2>
			<p>
				Para cadastrá-lo e proporcionar a você os serviços de intermediação
				comercial, a VENDA+ Agromarket Brasil coleta e trata os seguintes
				dados: nome completo, CPF/CNPJ, endereço, e-mail, telefone, dados
				bancários (para transações) e informações sobre seus produtos e
				navegação.
			</p>
			<p>
				Essas informações são utilizadas para autenticação, operações
				comerciais, emissão de documentos fiscais, comunicação, melhoria da
				plataforma e prevenção de fraudes.
			</p>

			<h2 style='font-weight: 600;'>2. Compartilhamento</h2>
			<p>
				Seus dados não serão vendidos. Eles poderão ser compartilhados
				apenas com:
			</p>
			<ul style='list-style: inside;'>
				<li>Autoridades públicas, quando exigido por lei;</li>
				<li>
					Parceiros comerciais e prestadores de serviços essenciais para a
					operação da plataforma (ex.: logística, pagamento), todos
					obrigados a manter a confidencialidade.
				</li>
			</ul>

			<h2 style='font-weight: 600;'>3. Seus Direitos</h2>
			<p>
				Você tem o direito de acessar, corrigir, eliminar ou portar seus
				dados pessoais, além de poder revogar este consentimento a qualquer
				momento. Para exercer esses direitos, entre em contato pelo e-mail:
				contato@vendamais.com.br.
			</p>

			<h2 style='font-weight: 600;'>4. Segurança e Cookies</h2>
			<p>
				A VENDA+ Agromarket Brasil adota medidas de segurança técnicas e
				administrativas para proteger suas informações.A plataforma utiliza
				cookies para melhorar a experiência de navegação, e você pode
				gerenciar suas preferências no seu navegador.
			</p>

			<h2 style='font-weight: 600;'>5. Consentimento</h2>
			<p>
				Ao se cadastrar na plataforma, você consente de forma livre,
				informada e inequívoca com o tratamento dos seus dados pessoais para
				as finalidades descritas nesta Política de Privacidade.
			</p>
		`,
	},
	termsOfUse: {
		title: 'Termos de uso da VENDA+ Agromarket Brasil',
		description:
			'Termo de Aceitação dos Termos de Uso - VENDA+ Agromarket Brasil',
		content: `
			<p>
				Ao finalizar seu cadastro na plataforma VENDA+ Agromarket Brasil,
				operada pela VENDAMAIS AGROMARKET BRASIL INOVA SIMPLES (I.S.) (CNPJ:
				62.591.442/0001-07), você declara estar ciente e concordar expressamente com os
				seguintes termos e condições que regem o uso da plataforma.
			</p>

			<h2 style='font-weight: 600;'>1. Objeto e Aceitação</h2>
			<p>
				A plataforma VENDA+ tem como objeto intermediar negócios entre produtores, cooperativas,
				distribuidores especializados, compradores e agentes logísticos do agronegócio. O uso da
				plataforma implica na aceitação integral e obrigatória destes Termos.
			</p>

			<h2 style='font-weight: 600;'>2. Suas Responsabilidades</h2>
			<p>
				Você é o único e integral responsável:
			</p>
			<ul style='list-style: inside;'>
				<li>Pela veracidade, precisão e atualização de todas as informações por você cadastradas;</li>
				<li>Por toda e qualquer atividade realizada em sua conta;</li>
				<li>Pelo cumprimento das obrigações financeiras e contratuais decorrentes das operações realizadas.</li>
			</ul>

			<h2 style='font-weight: 600;'>3. Restrições de Uso</h2>
			<p>
				É expressamente proibido utilizar a plataforma para:
			</p>
			<ul style='list-style: inside;'>
				<li>Cadastrar ou divulgar informações falsas, enganosas ou de terceiros sem autorização;</li>
				<li>Praticar qualquer ato ilícito, fraudulento ou que viole direitos de terceiros;</li>
				<li>Tentativa de acesso não autorizado a sistemas ou dados de outros usuários.</li>
			</ul>

			<h2 style='font-weight: 600;'>4. Consequências por Descumprimento</h2>
			<p>
				O descumprimento destes Termos ou a prática de atos ilícitos poderá resultar, a critério exclusivo da
				administração da plataforma, em:
			</p>
			<ul style='list-style: inside;'>
				<li>Suspensão ou cancelamento imediato da sua conta, sem aviso prévio;</li>
				<li>Impossibilidade de realizar novo cadastro;</li>
				<li>Comunicação às autoridades competentes; e</li>
				<li>Responsabilização cível e criminal, com obrigação de indenizar a plataforma e terceiros por quaisquer danos causados.</li>
			</ul>

			<h2 style='font-weight: 600;'>5. Alterações dos Termos</h2>
			<p>
				Estes Termos de Uso podem ser alterados a qualquer tempo. As versões atualizadas serão
				disponibilizadas na plataforma, e é sua responsabilidade consultá-las periodicamente. O uso
				continuado da plataforma após alterações significa sua aceitação dos novos termos.
			</p>
			
			<p>
				<b>Consentimento Final:</b> Ao se cadastrar na plataforma, você declara ter lido, compreendido e aceito
				integralmente todos os termos e condições aqui estabelecidos, concordando em vincularem-se juridicamente aos
				mesmos.
			</p>
		`,
	},
};

function getDocumentTitle(type: 'privacyPolicy' | 'termsOfUse') {
	return signUpDocumentData[type].title;
}

function getDocumentDescription(type: 'privacyPolicy' | 'termsOfUse') {
	return signUpDocumentData[type].description;
}

function getDocumentContent(type: 'privacyPolicy' | 'termsOfUse') {
	return DOMPurify.sanitize(signUpDocumentData[type].content);
}

export { getDocumentTitle, getDocumentDescription, getDocumentContent };
