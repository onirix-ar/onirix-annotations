const RICH_FIELD_CSS = `
.ox-rich-field {
  margin-bottom: 20px;
}
.ox-rich-field > * {
  cursor: text;
}
.ox-rich-field p,
.ox-rich-field ol,
.ox-rich-field ul,
.ox-rich-field pre,
.ox-rich-field blockquote,
.ox-rich-field h1,
.ox-rich-field h2,
.ox-rich-field h3,
.ox-rich-field h4,
.ox-rich-field h5,
.ox-rich-field h6 {
  margin: 0;
  padding: 0;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ox-rich-field ol,
.ox-rich-field ul {
  padding-left: 1.5em;
}
.ox-rich-field ol > li,
.ox-rich-field ul > li {
  list-style-type: none;
}
.ox-rich-field ul > li::before {
  content: '\x82';
}
.ox-rich-field ul[data-checked=true],
.ox-rich-field ul[data-checked=false] {
  pointer-events: none;
}
.ox-rich-field ul[data-checked=true] > li *,
.ox-rich-field ul[data-checked=false] > li * {
  pointer-events: all;
}
.ox-rich-field ul[data-checked=true] > li::before,
.ox-rich-field ul[data-checked=false] > li::before {
  color: #777;
  cursor: pointer;
  pointer-events: all;
}
.ox-rich-field ul[data-checked=true] > li::before {
  content: '\xb1';
}
.ox-rich-field ul[data-checked=false] > li::before {
  content: '\xb1';
}
.ox-rich-field li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}
.ox-rich-field li:not(.ql-direction-rtl)::before {
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}
.ox-rich-field li.ql-direction-rtl::before {
  margin-left: 0.3em;
  margin-right: -1.5em;
}
.ox-rich-field ol li:not(.ql-direction-rtl),
.ox-rich-field ul li:not(.ql-direction-rtl) {
  padding-left: 1.5em;
}
.ox-rich-field ol li.ql-direction-rtl,
.ox-rich-field ul li.ql-direction-rtl {
  padding-right: 1.5em;
}
.ox-rich-field ol li {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  counter-increment: list-0;
}
.ox-rich-field ol li:before {
  content: counter(list-0, decimal) '. ';
}
.ox-rich-field ol li.ql-indent-1 {
  counter-increment: list-1;
}
.ox-rich-field ol li.ql-indent-1:before {
  content: counter(list-1, lower-alpha) '. ';
}
.ox-rich-field ol li.ql-indent-1 {
  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-2 {
  counter-increment: list-2;
}
.ox-rich-field ol li.ql-indent-2:before {
  content: counter(list-2, lower-roman) '. ';
}
.ox-rich-field ol li.ql-indent-2 {
  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-3 {
  counter-increment: list-3;
}
.ox-rich-field ol li.ql-indent-3:before {
  content: counter(list-3, decimal) '. ';
}
.ox-rich-field ol li.ql-indent-3 {
  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-4 {
  counter-increment: list-4;
}
.ox-rich-field ol li.ql-indent-4:before {
  content: counter(list-4, lower-alpha) '. ';
}
.ox-rich-field ol li.ql-indent-4 {
  counter-reset: list-5 list-6 list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-5 {
  counter-increment: list-5;
}
.ox-rich-field ol li.ql-indent-5:before {
  content: counter(list-5, lower-roman) '. ';
}
.ox-rich-field ol li.ql-indent-5 {
  counter-reset: list-6 list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-6 {
  counter-increment: list-6;
}
.ox-rich-field ol li.ql-indent-6:before {
  content: counter(list-6, decimal) '. ';
}
.ox-rich-field ol li.ql-indent-6 {
  counter-reset: list-7 list-8 list-9;
}
.ox-rich-field ol li.ql-indent-7 {
  counter-increment: list-7;
}
.ox-rich-field ol li.ql-indent-7:before {
  content: counter(list-7, lower-alpha) '. ';
}
.ox-rich-field ol li.ql-indent-7 {
  counter-reset: list-8 list-9;
}
.ox-rich-field ol li.ql-indent-8 {
  counter-increment: list-8;
}
.ox-rich-field ol li.ql-indent-8:before {
  content: counter(list-8, lower-roman) '. ';
}
.ox-rich-field ol li.ql-indent-8 {
  counter-reset: list-9;
}
.ox-rich-field ol li.ql-indent-9 {
  counter-increment: list-9;
}
.ox-rich-field ol li.ql-indent-9:before {
  content: counter(list-9, decimal) '. ';
}
.ox-rich-field .ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 3em;
}
.ox-rich-field li.ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 4.5em;
}
.ox-rich-field .ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 3em;
}
.ox-rich-field li.ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 4.5em;
}
.ox-rich-field .ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 6em;
}
.ox-rich-field li.ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 7.5em;
}
.ox-rich-field .ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 6em;
}
.ox-rich-field li.ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 7.5em;
}
.ox-rich-field .ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 9em;
}
.ox-rich-field li.ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 10.5em;
}
.ox-rich-field .ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 9em;
}
.ox-rich-field li.ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 10.5em;
}
.ox-rich-field .ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 12em;
}
.ox-rich-field li.ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 13.5em;
}
.ox-rich-field .ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 12em;
}
.ox-rich-field li.ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 13.5em;
}
.ox-rich-field .ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 15em;
}
.ox-rich-field li.ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 16.5em;
}
.ox-rich-field .ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 15em;
}
.ox-rich-field li.ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 16.5em;
}
.ox-rich-field .ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 18em;
}
.ox-rich-field li.ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 19.5em;
}
.ox-rich-field .ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 18em;
}
.ox-rich-field li.ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 19.5em;
}
.ox-rich-field .ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 21em;
}
.ox-rich-field li.ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 22.5em;
}
.ox-rich-field .ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 21em;
}
.ox-rich-field li.ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 22.5em;
}
.ox-rich-field .ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 24em;
}
.ox-rich-field li.ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 25.5em;
}
.ox-rich-field .ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 24em;
}
.ox-rich-field li.ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 25.5em;
}
.ox-rich-field .ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 27em;
}
.ox-rich-field li.ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 28.5em;
}
.ox-rich-field .ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 27em;
}
.ox-rich-field li.ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 28.5em;
}
.ox-rich-field .ql-video {
  display: block;
  max-width: 100%;
}
.ox-rich-field .ql-video.ql-align-center {
  margin: 0 auto;
}
.ox-rich-field .ql-video.ql-align-right {
  margin: 0 0 0 auto;
}
.ox-rich-field .ql-bg-black {
  background-color: #000;
}
.ox-rich-field .ql-bg-red {
  background-color: #e60000;
}
.ox-rich-field .ql-bg-orange {
  background-color: #f90;
}
.ox-rich-field .ql-bg-yellow {
  background-color: #ff0;
}
.ox-rich-field .ql-bg-green {
  background-color: #008a00;
}
.ox-rich-field .ql-bg-blue {
  background-color: #06c;
}
.ox-rich-field .ql-bg-purple {
  background-color: #93f;
}
.ox-rich-field .ql-color-white {
  color: #fff;
}
.ox-rich-field .ql-color-red {
  color: #e60000;
}
.ox-rich-field .ql-color-orange {
  color: #f90;
}
.ox-rich-field .ql-color-yellow {
  color: #ff0;
}
.ox-rich-field .ql-color-green {
  color: #008a00;
}
.ox-rich-field .ql-color-blue {
  color: #06c;
}
.ox-rich-field .ql-color-purple {
  color: #93f;
}
.ox-rich-field .ql-font-serif {
  font-family: Georgia, Times New Roman, serif;
}
.ox-rich-field .ql-font-monospace {
  font-family: Monaco, Courier New, monospace;
}
.ox-rich-field .ql-size-small {
  font-size: 0.75em;
}
.ox-rich-field .ql-size-large {
  font-size: 1.5em;
}
.ox-rich-field .ql-size-huge {
  font-size: 2.5em;
}
.ox-rich-field .ql-direction-rtl {
  direction: rtl;
  text-align: inherit;
}
.ox-rich-field .ql-align-center {
  text-align: center;
}
.ox-rich-field .ql-align-justify {
  text-align: justify;
}
.ox-rich-field .ql-align-right {
  text-align: right;
}
.ox-rich-field.ql-blank::before {
  color: rgba(0,0,0,0.6);
  content: attr(data-placeholder);
  font-style: italic;
  left: 15px;
  pointer-events: none;
  position: absolute;
  right: 15px;
}

`;
 
export default RICH_FIELD_CSS;