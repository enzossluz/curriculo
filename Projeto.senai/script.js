// Script de Interatividade e Personalização do Currículo
document.addEventListener('DOMContentLoaded', () => {
  const resume = document.getElementById('resume');
  const printBtn = document.getElementById('print-btn');
  const toggleEditBtn = document.getElementById('toggle-edit-btn');
  const editBtnText = document.getElementById('edit-btn-text');
  const resetBtn = document.getElementById('reset-btn');
  const themeModeBtn = document.getElementById('theme-mode-btn');
  const modeText = document.getElementById('mode-text');
  const exportJsonBtn = document.getElementById('export-json-btn');
  const colorDots = document.querySelectorAll('.color-dot');

  const avatarContainer = document.querySelector('.avatar-container');
  const avatarUpload = document.getElementById('avatar-upload');
  const avatarImg = document.getElementById('avatar-img');
  const avatarDisplay = document.getElementById('avatar-display');

  const STORAGE_KEY_CONTENT = 'enzo_resume_draft';
  const STORAGE_KEY_SHEET = 'enzo_resume_sheet';
  const STORAGE_KEY_THEME = 'enzo_resume_theme';
  const STORAGE_KEY_AVATAR = 'enzo_resume_avatar';

  const defaultResumeHTML = resume.innerHTML;

  // 1. Ação de Impressão / Salvar PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 2. Alternar Modo de Edição Direta
  let isEditing = true;
  if (toggleEditBtn && resume) {
    toggleEditBtn.addEventListener('click', () => {
      isEditing = !isEditing;
      resume.setAttribute('contenteditable', isEditing ? 'true' : 'false');

      if (isEditing) {
        editBtnText.textContent = 'Modo Edição: Ligado';
        toggleEditBtn.classList.remove('btn-secondary');
        toggleEditBtn.classList.add('btn-primary');
        toggleEditBtn.style.backgroundColor = '#16a34a';
        toggleEditBtn.style.color = '#fff';
      } else {
        editBtnText.textContent = 'Modo Edição: Desligado';
        toggleEditBtn.classList.remove('btn-primary');
        toggleEditBtn.classList.add('btn-secondary');
        toggleEditBtn.style.backgroundColor = '';
        toggleEditBtn.style.color = '';
      }
    });
  }

  // 3. Alternar Modo Folha Clara / Folha Azul Marinho
  const savedSheet = localStorage.getItem(STORAGE_KEY_SHEET);
  if (savedSheet) {
    document.documentElement.setAttribute('data-sheet', savedSheet);
    if (modeText) {
      modeText.textContent = savedSheet === 'light' ? 'Folha Marinho' : 'Folha Clara';
    }
  }

  if (themeModeBtn) {
    themeModeBtn.addEventListener('click', () => {
      const currentSheet = document.documentElement.getAttribute('data-sheet');
      const newSheet = currentSheet === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-sheet', newSheet);
      localStorage.setItem(STORAGE_KEY_SHEET, newSheet);

      if (modeText) {
        modeText.textContent = newSheet === 'light' ? 'Folha Marinho' : 'Folha Clara';
      }
    });
  }

    // 4. Seletor de Cores de Fundo e Tema
    const validThemes = ['navy', 'emerald', 'indigo', 'slate', 'cyan'];
    let savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (!validThemes.includes(savedTheme)) {
      savedTheme = 'navy';
    }

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    colorDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === savedTheme);
      });

      colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          const selectedColor = dot.dataset.color;

          // Aplica imediatamente a nova cor de fundo e paleta na página inteira
          document.documentElement.setAttribute('data-theme', selectedColor);
          document.body.setAttribute('data-theme', selectedColor);
          localStorage.setItem(STORAGE_KEY_THEME, selectedColor);

          // Atualiza o estado visual ativo dos botões
          colorDots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });

      // 5. Upload e Troca de Foto de Perfil Opcional
      const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
      if (savedAvatar && avatarImg && avatarDisplay) {
        avatarImg.src = savedAvatar;
        avatarImg.style.display = 'block';
        avatarDisplay.style.display = 'none';
      }

      if (avatarContainer && avatarUpload) {
        avatarContainer.addEventListener('click', () => {
          avatarUpload.click();
        });

        avatarUpload.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target.result;
              avatarImg.src = dataUrl;
              avatarImg.style.display = 'block';
              avatarDisplay.style.display = 'none';
              localStorage.setItem(STORAGE_KEY_AVATAR, dataUrl);
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // 6. Backup em JSON
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
          const backupData = {
            name: 'Enzo Souza Luz',
            date: new Date().toISOString(),
            theme: document.documentElement.getAttribute('data-theme'),
            sheet: document.documentElement.getAttribute('data-sheet'),
            contentHtml: resume.innerHTML
          };

          const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'curriculo_enzo_luz_backup.json';
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      // 7. Restaurar Versão Padrão
      if (resetBtn && resume) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Deseja restaurar o currículo para o modelo inicial? Qualquer alteração feita será descartada.')) {
            localStorage.removeItem(STORAGE_KEY_CONTENT);
            localStorage.removeItem(STORAGE_KEY_SHEET);
            localStorage.removeItem(STORAGE_KEY_THEME);
            localStorage.removeItem(STORAGE_KEY_AVATAR);

            resume.innerHTML = defaultResumeHTML;
            document.documentElement.setAttribute('data-theme', 'navy');
            document.documentElement.setAttribute('data-sheet', 'dark');

            if (modeText) modeText.textContent = 'Folha Clara';
            if (avatarImg && avatarDisplay) {
              avatarImg.style.display = 'none';
              avatarDisplay.style.display = 'block';
            }
          }
        });
      }

      // 8. Salvar alterações no LocalStorage automaticamente
      const savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);
      if (savedContent) {
        resume.innerHTML = savedContent;
      }

      let timeoutId;
      resume.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          localStorage.setItem(STORAGE_KEY_CONTENT, resume.innerHTML);
        }, 600);
      });
    });
