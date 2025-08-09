const fs = require('fs');
const axios = require('axios');

// Google Sheets API를 통해 데이터 가져오기
async function fetchSheetData(sheetId, range, apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data.values;
  } catch (error) {
    console.error('시트 데이터 가져오기 실패:', error.message);
    throw error;
  }
}

// 배열 데이터를 JSON 객체로 변환
function convertRowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      let value = row[index] || '';
      
      // 특별 처리가 필요한 필드들
      if (header === 'situations' || header === 'tags') {
        // 콤마로 구분된 문자열을 배열로 변환
        value = value.split(',').map(item => item.trim()).filter(item => item);
      } else if (header === 'views') {
        // 숫자 변환
        value = parseInt(value) || 0;
      } else if (header === 'deadline') {
        // 날짜 형식 검증 (YYYY-MM-DD)
        if (value && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          console.warn(`잘못된 날짜 형식: ${value}`);
        }
      }
      
      obj[header] = value;
    });
    return obj;
  });
}

// 데이터 검증
function validatePolicyData(policies) {
  const requiredFields = ['id', 'title', 'summary', 'category', 'source', 'situations', 'target', 'amount', 'deadline', 'applicationUrl'];
  const errors = [];
  
  policies.forEach((policy, index) => {
    requiredFields.forEach(field => {
      if (!policy[field]) {
        errors.push(`정책 ${index + 1}: ${field} 필드가 비어있습니다.`);
      }
    });
    
    // URL 형식 검증
    if (policy.applicationUrl && !policy.applicationUrl.startsWith('http')) {
      errors.push(`정책 ${index + 1}: applicationUrl이 올바른 URL 형식이 아닙니다.`);
    }
    
    // 카테고리 검증
    const validCategories = ['housing', 'employment-education', 'welfare', 'finance-startup', 'medical'];
    if (policy.category && !validCategories.includes(policy.category)) {
      errors.push(`정책 ${index + 1}: 유효하지 않은 카테고리입니다. (${policy.category})`);
    }
  });
  
  return errors;
}

async function main() {
  const apiKey = process.env.SHEETS_API_KEY;
  const sheetId = process.env.SHEETS_ID;
  
  if (!apiKey || !sheetId) {
    throw new Error('GOOGLE_SHEETS_API_KEY 또는 GOOGLE_SHEETS_ID 환경변수가 설정되지 않았습니다.');
  }
  
  try {
    console.log('📊 Google Sheets에서 정책 데이터를 가져오는 중...');
    
    // 정책 데이터 가져오기
    const policyRows = await fetchSheetData(sheetId, '정책목록!A:Z', apiKey);
    const policies = convertRowsToObjects(policyRows);
    
    // 상황 데이터 가져오기 (선택사항)
    let situations = [];
    try {
      const situationRows = await fetchSheetData(sheetId, '상황데이터!A:Z', apiKey);
      situations = convertRowsToObjects(situationRows);
    } catch (error) {
      console.warn('상황 데이터 시트를 찾을 수 없습니다. 기존 데이터를 유지합니다.');
      // 기존 situations.json 파일 유지
      if (fs.existsSync('src/data/situations.json')) {
        const existingData = JSON.parse(fs.readFileSync('src/data/situations.json', 'utf8'));
        situations = existingData.situations || [];
      }
    }
    
    // 데이터 검증
    const errors = validatePolicyData(policies);
    if (errors.length > 0) {
      console.error('❌ 데이터 검증 실패:');
      errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }
    
    // JSON 파일 생성
    const policiesData = { policies };
    const situationsData = { situations };
    
    fs.writeFileSync('src/data/policies.json', JSON.stringify(policiesData, null, 2));
    if (situations.length > 0) {
      fs.writeFileSync('src/data/situations.json', JSON.stringify(situationsData, null, 2));
    }
    
    console.log(`✅ 성공적으로 업데이트되었습니다:`);
    console.log(`  - 정책 데이터: ${policies.length}개`);
    console.log(`  - 상황 데이터: ${situations.length}개`);
    
  } catch (error) {
    console.error('❌ 업데이트 실패:', error.message);
    process.exit(1);
  }
}

main();
