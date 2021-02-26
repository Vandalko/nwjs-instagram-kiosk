jQuery.keyboard.language.ru = {
  language: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439 (Russian)',
  display : {
    'a'      : '\u2714:Сохранить (Shift+Enter)', // check mark - same action as accept
    'accept' : 'Сохранить:Сохранить (Shift+Enter)',
    'alt'    : 'РУС:Русская клавиатура',
    'b'      : '\u2190:Удалить символ слева',    // Left arrow (same as &larr;)
    'bksp'   : '\u21e6:Удалить символ слева',
    'c'      : '\u2716:Отменить (Esc)', // big X, close - same action as cancel
    'cancel' : 'Отменить:Отменить (Esc)',
    'clear'  : 'C:Очистить',             // clear num pad
    'combo'  : '\u00f6:Toggle Combo Keys',
    'dec'    : ',:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
    'e'      : '\u21b5:Ввод',        // down, then left arrow - enter symbol
    'enter'  : 'Ввод:Перевод строки',
    'lock'   : '\u21ea Lock:Caps Lock', // caps lock
    's'      : '\u21e7:Верхний регистр',        // thick hollow up arrow
    'shift'  : '\u21e7:Верхний регистр',
    'sign'   : '\u00b1:Сменить знак',  // +/- sign for num pad
    'space'  : '&nbsp;:Пробел:',
    't'      : '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
    'tab'    : '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
  },
  // Message added to the key title while hovering, if the mousewheel plugin exists
  wheelMessage : 'Use mousewheel to see other keys',
};


App.queryKeyboard = function(selector) {
  return $(selector).keyboard({
      usePreview: false,
      autoAccept: true,
      autoAcceptOnEsc: true,
      resetDefault: true,
      useCombos: false,
      keyBinding: 'mousedown touchstart',
      language: 'ru',
      layout: 'custom',
      // only use !! in the action key layout
      customLayout: {
          'default': [
             "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
             "q w e r t y u i o p [ ] \\",
             "a s d f g h j k l ; '",
             "{meta2:\u21e7} \\ z x c v b n m , . / {meta2:\u21e7}",
             "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta1': [
             "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
             "q w e r t y u i o p [ ] \\",
             "a s d f g h j k l ; '",
             "{meta2:\u21e7} \\ z x c v b n m , . / {meta2:\u21e7}",
             "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta2': [
              "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
              "Q W E R T Y U I O P { } |",
              'A S D F G H J K L : "',
              "{meta1:\u21e7} | Z X C V B N M < > / {meta1:\u21e7}",
              "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta10': [
              "ё 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
              "й ц у к е н г ш щ з х ъ \\",
              "ф ы в а п р о л д ж э",
              "{meta20:\u21e7} \\ я ч с м и т ь б ю / {meta20:\u21e7}",
              "{meta1:EN} {meta100:УКР} {space} {left} {right}"
              ],
          'meta20': [
              'Ё ! " № ; % : ? * ( ) _ + {bksp}',
              "Й Ц У К Е Н Г Ш Щ З Х Ъ /",
              "Ф Ы В А П Р О Л Д Ж Э",
              "{meta10:\u21e7} / Я Ч С М И Т Ь Б Ю / {meta10:\u21e7}",
              "{meta1:EN} {meta100:УКР} {space} {left} {right}"
              ],
          'meta100': [
              "' 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
              "й ц у к е н г ш щ з х ї \\",
              "ф і в а п р о л д ж є",
              "{meta200:\u21e7} ґ я ч с м и т ь б ю / {meta200:\u21e7}",
              "{meta1:EN} {meta10:РУ} {space} {left} {right}"
              ],
          'meta200': [
              '₴ ! " № ; % : ? * ( ) _ + {bksp}',
              "Й Ц У К Е Н Г Ш Щ З Х Ї /",
              "Ф І В А П Р О Л Д Ж Є",
              "{meta100:\u21e7} Ґ Я Ч С М И Т Ь Б Ю / {meta100:\u21e7}",
              "{meta1:EN} {meta10:РУ} {space} {left} {right}"
              ]
      },
      css: {
        // keyboard container
        container: 'center-block dropdown-menu kb-container-kiosk-query',
        // default state
        buttonDefault: 'btn btn-default kb-button-kiosk',
        // hovered button
        buttonHover: 'btn-primary',
        // Action keys (e.g. Accept, Cancel, Tab, etc);
        // this replaces "actionClass" option
        buttonAction: 'active',
        // used when disabling the decimal button {dec}
        // when a decimal exists in the input area
        buttonDisabled: 'disabled'
      },
      change: function(e, keyboard, el) {
        $(el).trigger('change');
        App.model.spawnSession();
      }
  }).getkeyboard();
}

App.editorKeyboard = function(selector) {
  return $(selector).keyboard({
      openOn: null,
      alwaysOpen: true,
      usePreview: false,
      autoAccept: true,
      autoAcceptOnEsc: true,
      resetDefault: true,
      useCombos: false,
      keyBinding: 'mousedown touchstart',
      language: 'ru',
      layout: 'custom',
      // only use !! in the action key layout
      customLayout: {
          'default': [
             "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
             "q w e r t y u i o p [ ] \\",
             "a s d f g h j k l ; ' {enter:\u21b5}",
             "{meta2:\u21e7} \\ z x c v b n m , . / {meta2:\u21e7}",
             "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta1': [
             "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
             "q w e r t y u i o p [ ] \\",
             "a s d f g h j k l ; ' {enter:\u21b5}",
             "{meta2:\u21e7} \\ z x c v b n m , . / {meta2:\u21e7}",
             "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta2': [
              "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
              "Q W E R T Y U I O P { } |",
              'A S D F G H J K L : " {enter:\u21b5}',
              "{meta1:\u21e7} | Z X C V B N M < > / {meta1:\u21e7}",
              "{meta10:РУ} {meta100:УКР} {space} {left} {right}"
              ],
          'meta10': [
              "ё 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
              "й ц у к е н г ш щ з х ъ \\",
              "ф ы в а п р о л д ж э {enter:\u21b5}",
              "{meta20:\u21e7} \\ я ч с м и т ь б ю / {meta20:\u21e7}",
              "{meta1:EN} {meta100:УКР} {space} {left} {right}"
              ],
          'meta20': [
              'Ё ! " № ; % : ? * ( ) _ + {bksp}',
              "Й Ц У К Е Н Г Ш Щ З Х Ъ /",
              "Ф Ы В А П Р О Л Д Ж Э {enter:\u21b5}",
              "{meta10:\u21e7} / Я Ч С М И Т Ь Б Ю / {up!!:\u2191}",
              "{meta1:EN} {meta100:УКР} {space} {left} {right}"
              ],
          'meta100': [
              "' 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
              "й ц у к е н г ш щ з х ї \\",
              "ф і в а п р о л д ж є {enter:\u21b5}",
              "{meta200:\u21e7} ґ я ч с м и т ь б ю / {meta200:\u21e7}",
              "{meta1:EN} {meta10:РУ} {space} {left} {right}"
              ],
          'meta200': [
              '₴ ! " № ; % : ? * ( ) _ + {bksp}',
              "Й Ц У К Е Н Г Ш Щ З Х Ї /",
              "Ф І В А П Р О Л Д Ж Є {enter:\u21b5}",
              "{meta100:\u21e7} Ґ Я Ч С М И Т Ь Б Ю / {meta100:\u21e7}",
              "{meta1:EN} {meta10:РУ} {space} {left} {right}"
              ]
      },
      css: {
        // keyboard container
        container: 'center-block dropdown-menu kb-container-kiosk-text',
        // default state
        buttonDefault: 'btn btn-default kb-button-kiosk',
        // hovered button
        buttonHover: 'btn-primary',
        // Action keys (e.g. Accept, Cancel, Tab, etc);
        // this replaces "actionClass" option
        buttonAction: '',
        // used when disabling the decimal button {dec}
        // when a decimal exists in the input area
        buttonDisabled: 'disabled'
      },
      change: function(e, keyboard, el) {
        $(el).trigger('change');
        App.model.spawnSession();
      }
  }).getkeyboard();
}
