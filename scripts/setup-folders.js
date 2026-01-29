/**
 * 프로젝트 폴더 구조 자동 생성 스크립트
 *
 * 실행: node scripts/setup-folders.js
 *
 * ES 모듈 문법 사용 (import/export)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES 모듈에서 __dirname 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
};

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} ${dirPath}`);
  }
};

const createFile = (filePath, content = "") => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`${colors.green}✓${colors.reset} ${filePath}`);
  }
};

console.log(
  `\n${colors.blue}📁 프로젝트 폴더 구조 자동 생성 시작...${colors.reset}\n`,
);

const baseDir = "src";
const dirs = [
  `${baseDir}/components`,
  `${baseDir}/components/common`,
  `${baseDir}/components/cards`,
  `${baseDir}/components/modals`,
  `${baseDir}/views`,
  `${baseDir}/views/contents`,
  `${baseDir}/views/logo`,
  `${baseDir}/views/colorPalette`,
  `${baseDir}/views/audit`,
  `${baseDir}/stores`,
  `${baseDir}/services`,
  `${baseDir}/types`,
  `${baseDir}/styles`,
  `${baseDir}/utils`,
  `${baseDir}/router`,
];

console.log(`${colors.blue}📂 디렉토리 생성:${colors.reset}`);
dirs.forEach((dir) => createDir(dir));

console.log(`\n${colors.blue}📝 타입 정의 파일:${colors.reset}`);
createFile(`${baseDir}/types/index.ts`);
createFile(`${baseDir}/types/admin.ts`);

console.log(`\n${colors.blue}🔌 API 서비스 파일:${colors.reset}`);
createFile(`${baseDir}/services/api.ts`);
createFile(`${baseDir}/services/contentService.ts`);
createFile(`${baseDir}/services/logoService.ts`);
createFile(`${baseDir}/services/colorService.ts`);

console.log(`\n${colors.blue}💾 Pinia 스토어 파일:${colors.reset}`);
createFile(`${baseDir}/stores/index.ts`);
createFile(`${baseDir}/stores/contentStore.ts`);
createFile(`${baseDir}/stores/logoStore.ts`);
createFile(`${baseDir}/stores/colorStore.ts`);

console.log(`\n${colors.blue}⚙️ Vue 컴포넌트 파일:${colors.reset}`);
const componentFiles = [
  `${baseDir}/components/common/Sidebar.vue`,
  `${baseDir}/components/common/Header.vue`,
  `${baseDir}/components/common/Breadcrumb.vue`,
  `${baseDir}/components/cards/AgentCard.vue`,
  `${baseDir}/components/cards/QaCard.vue`,
  `${baseDir}/components/cards/LogoCard.vue`,
  `${baseDir}/components/modals/PreviewModal.vue`,
  `${baseDir}/components/modals/DeleteConfirmModal.vue`,
];
componentFiles.forEach((file) => createFile(file));

console.log(`\n${colors.blue}📄 페이지 파일:${colors.reset}`);
const viewFiles = [
  `${baseDir}/views/Layout.vue`,
  `${baseDir}/views/contents/ContentsManage.vue`,
  `${baseDir}/views/contents/ContentsEdit.vue`,
  `${baseDir}/views/logo/LogoManage.vue`,
  `${baseDir}/views/logo/LogoEdit.vue`,
  `${baseDir}/views/colorPalette/ColorPaletteEdit.vue`,
  `${baseDir}/views/audit/AuditManage.vue`,
];
viewFiles.forEach((file) => createFile(file));

console.log(`\n${colors.blue}🛠️ 유틸리티 파일:${colors.reset}`);
createFile(`${baseDir}/utils/request.ts`);
createFile(`${baseDir}/utils/validate.ts`);
createFile(`${baseDir}/utils/format.ts`);

console.log(`\n${colors.blue}🎨 스타일 파일:${colors.reset}`);
createFile(`${baseDir}/styles/variables.scss`);
createFile(`${baseDir}/styles/global.scss`);
createFile(`${baseDir}/styles/theme.scss`);

console.log(`\n${colors.blue}🗺️ 라우터 파일:${colors.reset}`);
createFile(`${baseDir}/router/index.ts`);

console.log(`\n${colors.green}✅ 폴더 구조 생성 완료!${colors.reset}\n`);
console.log(`${colors.blue}📊 생성된 구조:${colors.reset}`);
console.log(`
src/
├── components/
│   ├── common/
│   ├── cards/
│   └── modals/
├── views/
│   ├── contents/
│   ├── logo/
│   ├── colorPalette/
│   └── audit/
├── stores/
├── services/
├── types/
├── styles/
├── utils/
├── router/
`);
console.log(`${colors.yellow}다음 단계: npm run dev 실행${colors.reset}\n`);
