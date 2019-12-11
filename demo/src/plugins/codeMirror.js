import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

// language
import 'codemirror/mode/javascript/javascript.js'

// theme css
import 'codemirror/theme/monokai.css'

// styleSelectedText
// import 'codemirror/addon/selection/active-line.js'
// import 'codemirror/addon/selection/mark-selection.js'
// import 'codemirror/addon/search/searchcursor.js'

// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/selection/active-line.js'

// highlightSelectionMatches
// import 'codemirror/addon/scroll/annotatescrollbar.js'
// import 'codemirror/addon/search/matchesonscrollbar.js'
// import 'codemirror/addon/search/searchcursor.js'
// import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/edit/matchbrackets.js'
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/addon/comment/comment.js'
// import 'codemirror/addon/dialog/dialog.js'
// import 'codemirror/addon/dialog/dialog.css'
// import 'codemirror/addon/search/searchcursor.js'
// import 'codemirror/addon/search/search.js'

// foldGutter
// import 'codemirror/addon/fold/foldgutter.css'
// import 'codemirror/addon/fold/brace-fold.js'
// import 'codemirror/addon/fold/comment-fold.js'
// import 'codemirror/addon/fold/foldcode.js'
// import 'codemirror/addon/fold/foldgutter.js'
// import 'codemirror/addon/fold/indent-fold.js'
// import 'codemirror/addon/fold/markdown-fold.js'
// import 'codemirror/addon/fold/xml-fold.js'

// you can set default global options and events when use
Vue.use(VueCodemirror, {
  options: {
    lineNumbers: true,
    mode: 'text/javascript',
    theme: 'monokai',
    tabSize: 2,
    matchBrackets: true,
    keyMap: "sublime",
    // styleActiveLine: true
  },
})