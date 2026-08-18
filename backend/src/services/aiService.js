/**
 * SmartFlow AI Classification Engine
 * Analyzes request descriptions to determine category, priority, department, and relevant keywords.
 */

async function classifyRequest(title, description) {
  const startTime = Date.now();
  const fullText = `${title} ${description}`.toLowerCase();

  console.log('\n================== 🧠 [IA ENGINE: INÍCIO DA TRIAGEM] ==================');
  console.log(`📥 Entrada Recebida:`);
  console.log(`   - Título: "${title}"`);
  console.log(`   - Descrição: "${description}"`);

  // Keyword mapping rules for intelligent classification
  let category = 'Geral';
  let priority = 'Média';
  let department = 'TI';
  const extractedKeywords = [];

  // Categorization Rules
  // 1. Recursos Humanos (RH) - Benefícios, Transporte (Cartão/Ônibus/Jaé/RioCard/VT), Folha, Férias, Pessoal
  if (/cart[aã]o|onibus|[oô]nibus|ja[eé]|riocard|bilhete|transporte|vale[\s\-]transporte|\bvt\b|alimenta[cç][aã]o|refei[cç][aã]o|\bva\b|\bvr\b|sodexo|alelo|crach[aá]|f[eé]rias|pagamento|sal[aá]rio|benef[ií]cio|contrato|\brh\b|atestado|admiss[aã]o|demiss[aã]o|desligamento|rescis[aã]o|holerite|contracheque|ponto|plano de sa[uú]de|conv[eê]nio|m[eé]dico|afastamento|licen[cç]a/i.test(fullText)) {
    category = 'Recursos Humanos';
    department = 'RH';
    extractedKeywords.push('rh', 'benefícios', 'pessoal');
    if (/onibus|[oô]nibus|ja[eé]|riocard|transporte|cart[aã]o/i.test(fullText)) {
      extractedKeywords.push('transporte', 'cartão');
    }
  } 
  // 2. Equipamentos & Hardware (TI)
  else if (/notebook|computador|laptop|macbook|desktop|\bpc\b|monitor|mouse|teclado|hardware|impressora|toner|headset|fone|webcam|carregador|adaptador|equipamento|nobreak|tela/i.test(fullText)) {
    category = 'Equipamentos';
    department = 'TI';
    extractedKeywords.push('hardware', 'equipamentos');
  } 
  // 3. Acesso ao Sistema & Software (TI)
  else if (/acesso|senha|login|sistema|permiss[aã]o|ssh|vpn|credencial|servidor|banco de dados|software|programa|aplicativo|docker|vscode|vs code|formata[cç][aã]o|antiv[ií]rus|wi[\s\-]?fi|internet|rede|email|e-mail/i.test(fullText)) {
    category = 'Acesso ao sistema';
    department = 'TI';
    extractedKeywords.push('sistema', 'acesso', 'segurança');
  } 
  // 4. Financeiro
  else if (/faturamento|nota[\s\-]fiscal|\bnf\b|reembolso|or[cç]amento|pagar|receber|imposto|financeiro|custo|boleto|despesa|comprovante|adiantamento/i.test(fullText)) {
    category = 'Financeiro';
    department = 'Financeiro';
    extractedKeywords.push('financeiro', 'fiscal');
  } 
  // 5. Compras & Suprimentos
  else if (/comprar|compra|fornecedor|cota[cç][aã]o|aquisi[cç][aã]o|suprimentos|material de escrit[oó]rio|papelaria/i.test(fullText)) {
    category = 'Compras';
    department = 'Compras';
    extractedKeywords.push('compras', 'fornecedor');
  }

  // Priority Determination Rules
  if (/urgente|lento|parado|bloqueado|crítico|erro grave|fora do ar|imediato|impossível trabalhar/i.test(fullText)) {
    priority = 'Alta';
    extractedKeywords.push('urgência');
  } else if (/férias|dúvida|ajuste simples|sugestão|melhoria/i.test(fullText)) {
    priority = 'Baixa';
  } else {
    priority = 'Média';
  }

  // Specific keyword extraction
  const words = fullText.split(/\W+/).filter(w => w.length > 4);
  const uniqueWords = Array.from(new Set(words)).slice(0, 3);
  uniqueWords.forEach(w => {
    if (!extractedKeywords.includes(w)) {
      extractedKeywords.push(w);
    }
  });

  const aiResult = {
    category,
    priority,
    department,
    ai_keywords: extractedKeywords
  };

  const elapsedMs = Date.now() - startTime;
  console.log(`📤 Resposta da IA (${elapsedMs}ms):`);
  console.log(`   - Categoria:      🏷️  ${aiResult.category}`);
  console.log(`   - Prioridade:     🔥  ${aiResult.priority}`);
  console.log(`   - Setor Destino:  🏢  ${aiResult.department}`);
  console.log(`   - Palavras-chave: 🔑 [ ${aiResult.ai_keywords.join(', ')} ]`);
  console.log('=======================================================================\n');

  return aiResult;
}

module.exports = {
  classifyRequest
};
