const DEFAULT_CSS = `

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Poppins:wght@400;600;800&display=swap');
@-webkit-keyframes fadeIn {
    from { top: 700px }
      to { top: 380px}
}
@keyframes fadeIn {
    from { top: 700px}
      to { top: 380px;}
}

@-webkit-keyframes fadeOut {
    from { opacity: 1 }
      to { opacity: 0}
}
@keyframes fadeOut {
    from { opacity: 1 }
      to { opacity: 0}
}

.ox-annotations > *:not(#ox-custom-html) {
    font-family: "Open Sans";
}

.ox-datasheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 380px;
    background-color: white;
    padding: 15px 30px;
    display: block;
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s;
}


.ox-datasheet--open {
    top: 0px !important;
    overflow: auto;
    transition: top .3s ease 0s;
}

.ox-datasheet--down {
    transition: top .3s ease 0s;
}

.ox-datasheet--close {
    animation: fadeOut .3s;
    -webkit-animation: fadeOut .3s;
}

.ox-datasheet--open .ox-datasheet__header img:first-child {
    transform: rotate(180deg);
}

.ox-datasheet__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #ecebeb;
}

.ox-datasheet__header span {
    font-size: 22px;
    font-weight: bold;
    line-height: 1.27;
    letter-spacing: normal;
    color: #000;
}

.ox-datasheet__header div {
    display: flex;
    cursor: pointer;
}

.ox-datasheet__header div img:first-child {
    margin-right: 20px;
    content: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzIgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+RDVDREJENDMtMzUzMC00QzI2LUE5MjMtNDlBODYxMkQ2NUI4PC90aXRsZT4KICAgIDxnIGlkPSJDdXJyZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTEctYWVyby9BUi1ob21lLWluc3RhbGxhdGlvbl9zdGVwcy1zdGVwX3NlbGVjdGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjc2LCAtNDc5KSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDQ2NSkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikljb25zL2ljb24tdXBfZG93biIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjkyLCAzMC4zMzY4KSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0yOTIsIC0zMC4zMzY4KXRyYW5zbGF0ZSgyNzYsIDE0LjMzNjgpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjQuODczMDExOCwxNS41NDU3MjczIEMyNS4yNDc5MjE1LDE1LjE3NTIyODMgMjUuODUyMTk0NywxNS4xNzg4MDM4IDI2LjIyMjY5MzgsMTUuNTUzNzEzNiBDMjYuNTkzMTkyOCwxNS45Mjg2MjMzIDI2LjU4OTYxNzIsMTYuNTMyODk2NSAyNi4yMTQ3MDc1LDE2LjkwMzM5NTUgTDE2LjY3MDg0NzgsMjYuMzM0OTc0NSBDMTYuMjk5Mzk2MSwyNi43MDIwNTYyIDE1LjcwMTg4NzgsMjYuNzAyNDIyOSAxNS4zMjk5ODU4LDI2LjMzNTc5NzMgTDUuNzg2MTI2MTYsMTYuOTI3MzQyNiBDNS40MTA3NjIsMTYuNTU3MzA0IDUuNDA2NDQ0NzksMTUuOTUzMDM1NyA1Ljc3NjQ4MzQyLDE1LjU3NzY3MTUgQzYuMTQ2NTIyMDQsMTUuMjAyMzA3MyA2Ljc1MDc5MDM5LDE1LjE5Nzk5MDEgNy4xMjYxNTQ1NSwxNS41NjgwMjg4IEwxNS45OTkxNTc5LDI0LjMxNTE3MTkgTDI0Ljg3MzAxMTgsMTUuNTQ1NzI3MyBaIiBpZD0iUGF0aC0yIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0LjA4NDg2ODQsNS43MjYzMTU3OSBDMjQuNjExOTYxMiw1LjcyNjMxNTc5IDI1LjAzOTI1NDQsNi4xNTM2MDg5NCAyNS4wMzkyNTQ0LDYuNjgwNzAxNzUgQzI1LjAzOTI1NDQsNy4yMDc3OTQ1NyAyNC42MTE5NjEyLDcuNjM1MDg3NzIgMjQuMDg0ODY4NCw3LjYzNTA4NzcyIEw3LjkxNjQ0NzM3LDcuNjM1MDg3NzIgQzcuMzg5MzU0NTUsNy42MzUwODc3MiA2Ljk2MjA2MTQsNy4yMDc3OTQ1NyA2Ljk2MjA2MTQsNi42ODA3MDE3NSBDNi45NjIwNjE0LDYuMTUzNjA4OTQgNy4zODkzNTQ1NSw1LjcyNjMxNTc5IDcuOTE2NDQ3MzcsNS43MjYzMTU3OSBMMjQuMDg0ODY4NCw1LjcyNjMxNTc5IFoiIGlkPSJQYXRoLTYiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
}

.ox-datasheet__header div img:last-child {
    content: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+QzZGQTZEQUItRjRGNy00NkM1LUFDMzEtQjNCRkU2OUQ2Q0REPC90aXRsZT4KICAgIDxnIGlkPSJDdXJyZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTEctYWVyby9BUi1ob21lLWluc3RhbGxhdGlvbl9zdGVwcy1zdGVwX3NlbGVjdGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzI4LCAtNDc5KSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDQ2NSkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikljb25zL2ljb24tY2xvc2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyOCwgMTQpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuMTcyNzk2Niw1LjY2OTAwNjg2IEMyNS41NDU1MDc1LDUuMjk2Mjk1OTYgMjYuMTQ5NzkxMyw1LjI5NjI5NTk2IDI2LjUyMjUwMjIsNS42NjkwMDY4NiBDMjYuODk1MjEzMSw2LjA0MTcxNzc2IDI2Ljg5NTIxMzEsNi42NDYwMDE1MyAyNi41MjI1MDIyLDcuMDE4NzEyNDQgTDcuNDY3ODM1MjQsMjYuMDczMzc5NCBDNy4wOTUxMjQzNCwyNi40NDYwOTAzIDYuNDkwODQwNTcsMjYuNDQ2MDkwMyA2LjExODEyOTY3LDI2LjA3MzM3OTQgQzUuNzQ1NDE4NzcsMjUuNzAwNjY4NSA1Ljc0NTQxODc3LDI1LjA5NjM4NDcgNi4xMTgxMjk2NywyNC43MjM2NzM4IEwyNS4xNzI3OTY2LDUuNjY5MDA2ODYgWiIgaWQ9IlBhdGgtMiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNS4xNzI3OTY2LDUuNjY5MDA2ODYgQzI1LjU0NTUwNzUsNS4yOTYyOTU5NiAyNi4xNDk3OTEzLDUuMjk2Mjk1OTYgMjYuNTIyNTAyMiw1LjY2OTAwNjg2IEMyNi44OTUyMTMxLDYuMDQxNzE3NzYgMjYuODk1MjEzMSw2LjY0NjAwMTUzIDI2LjUyMjUwMjIsNy4wMTg3MTI0NCBMNy40Njc4MzUyNCwyNi4wNzMzNzk0IEM3LjA5NTEyNDM0LDI2LjQ0NjA5MDMgNi40OTA4NDA1NywyNi40NDYwOTAzIDYuMTE4MTI5NjcsMjYuMDczMzc5NCBDNS43NDU0MTg3NywyNS43MDA2Njg1IDUuNzQ1NDE4NzcsMjUuMDk2Mzg0NyA2LjExODEyOTY3LDI0LjcyMzY3MzggTDI1LjE3Mjc5NjYsNS42NjkwMDY4NiBaIiBpZD0iUGF0aC0yLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjMyMDMsIDE1Ljg3MTIpIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTE2LjMyMDMsIC0xNS44NzEyKSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
}

.ox-datasheet__content > p:first-child {
    font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #000;
  margin-top: 20px;
}


.ox-datasheet__content p {
    margin: 20px 0;
}

.ox-datasheet__content div div:not(.ox-rich-field) {
    width: fill-available;
    background-size: cover;
    background-position: 50%;
    width: fill-available;
    height: 163px;
    border-radius: 10px;
    border: 1px solid #ecebeb;
    margin-bottom: 20px;
}

.ox-expand {
    width: auto;
    height: auto;
    padding: 6px;
    opacity: 0.6;
    border-radius: 7.1px;
    background-color: #211f1f;
    position: absolute;
    margin-top: -62px;
    right: 38px;
    cursor: pointer;
    content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgPHBhdGggZD0iTTEuOTQ3IDcuODMyYS45My45MyAwIDAgMCAuOTI5LS45M1YzLjE4N2EuMzEuMzEgMCAwIDEgLjMxLS4zMWgzLjcxN2EuOTMuOTMgMCAxIDAgMC0xLjg1OEgzLjE4NmMtMS4xOTggMC0yLjE2OC45Ny0yLjE2OCAyLjE2OHYzLjcxN2MwIC41MTMuNDE2LjkyOS45MjkuOTI5ek0zLjE4NiAxOC45ODJoMy43MTdhLjkzLjkzIDAgMCAwIDAtMS44NThIMy4xODZhLjMxLjMxIDAgMCAxLS4zMS0uMzF2LTMuNzE3YS45My45MyAwIDAgMC0xLjg1OCAwdjMuNzE3YzAgMS4xOTguOTcgMi4xNjggMi4xNjggMi4xNjh6TTE2LjgxNCAxLjAxOGgtMy43MTdhLjkzLjkzIDAgMCAwIDAgMS44NThoMy43MTdhLjMxLjMxIDAgMCAxIC4zMS4zMXYzLjcxN2EuOTMuOTMgMCAwIDAgMS44NTggMFYzLjE4NmMwLTEuMTk4LS45Ny0yLjE2OC0yLjE2OC0yLjE2OHpNMTguMDUzIDEyLjE2OGEuOTMuOTMgMCAwIDAtLjkyOS45M3YzLjcxNmEuMzEuMzEgMCAwIDEtLjMxLjMxaC0zLjcxN2EuOTMuOTMgMCAwIDAgMCAxLjg1OGgzLjcxN2MxLjE5OCAwIDIuMTY4LS45NyAyLjE2OC0yLjE2OHYtMy43MTdhLjkzLjkzIDAgMCAwLS45MjktLjkyOXoiLz4KICAgIDwvZz4KPC9zdmc+Cg==');
}

.ox-image-preview {
    background: rgba(0, 0, 0, 0.9);
    z-index: 1;
    position: fixed;
    display: flex;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 60px 20px;
    align-items: center;
    justify-content: center;
    z-index: 999;
}
.ox-image-preview img:first-child {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    content: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+QzZGQTZEQUItRjRGNy00NkM1LUFDMzEtQjNCRkU2OUQ2Q0REPC90aXRsZT4KICAgIDxnIGlkPSJDdXJyZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTEctYWVyby9BUi1ob21lLWluc3RhbGxhdGlvbl9zdGVwcy1zdGVwX3NlbGVjdGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzI4LCAtNDc5KSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDQ2NSkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikljb25zL2ljb24tY2xvc2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyOCwgMTQpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuMTcyNzk2Niw1LjY2OTAwNjg2IEMyNS41NDU1MDc1LDUuMjk2Mjk1OTYgMjYuMTQ5NzkxMyw1LjI5NjI5NTk2IDI2LjUyMjUwMjIsNS42NjkwMDY4NiBDMjYuODk1MjEzMSw2LjA0MTcxNzc2IDI2Ljg5NTIxMzEsNi42NDYwMDE1MyAyNi41MjI1MDIyLDcuMDE4NzEyNDQgTDcuNDY3ODM1MjQsMjYuMDczMzc5NCBDNy4wOTUxMjQzNCwyNi40NDYwOTAzIDYuNDkwODQwNTcsMjYuNDQ2MDkwMyA2LjExODEyOTY3LDI2LjA3MzM3OTQgQzUuNzQ1NDE4NzcsMjUuNzAwNjY4NSA1Ljc0NTQxODc3LDI1LjA5NjM4NDcgNi4xMTgxMjk2NywyNC43MjM2NzM4IEwyNS4xNzI3OTY2LDUuNjY5MDA2ODYgWiIgaWQ9IlBhdGgtMiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNS4xNzI3OTY2LDUuNjY5MDA2ODYgQzI1LjU0NTUwNzUsNS4yOTYyOTU5NiAyNi4xNDk3OTEzLDUuMjk2Mjk1OTYgMjYuNTIyNTAyMiw1LjY2OTAwNjg2IEMyNi44OTUyMTMxLDYuMDQxNzE3NzYgMjYuODk1MjEzMSw2LjY0NjAwMTUzIDI2LjUyMjUwMjIsNy4wMTg3MTI0NCBMNy40Njc4MzUyNCwyNi4wNzMzNzk0IEM3LjA5NTEyNDM0LDI2LjQ0NjA5MDMgNi40OTA4NDA1NywyNi40NDYwOTAzIDYuMTE4MTI5NjcsMjYuMDczMzc5NCBDNS43NDU0MTg3NywyNS43MDA2Njg1IDUuNzQ1NDE4NzcsMjUuMDk2Mzg0NyA2LjExODEyOTY3LDI0LjcyMzY3MzggTDI1LjE3Mjc5NjYsNS42NjkwMDY4NiBaIiBpZD0iUGF0aC0yLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjMyMDMsIDE1Ljg3MTIpIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTE2LjMyMDMsIC0xNS44NzEyKSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
}

.ox-image-preview--horizontal {
    width: -webkit-fill-available;
    height: auto;
}

.ox-image-preview--vertical {
    height: auto;
    width:  -webkit-fill-available;
}

.ox-annotations > .ox-no-datasheet {
    padding: 30px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    position: absolute;
    background: white;
    border-radius: 10px;
    max-width: 250px;
    text-align: center;
}

.ox-annotations > .ox-no-datasheet > img {
    width: 20px;
    content: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+QzZGQTZEQUItRjRGNy00NkM1LUFDMzEtQjNCRkU2OUQ2Q0REPC90aXRsZT4KICAgIDxnIGlkPSJDdXJyZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTEctYWVyby9BUi1ob21lLWluc3RhbGxhdGlvbl9zdGVwcy1zdGVwX3NlbGVjdGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzI4LCAtNDc5KSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDQ2NSkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikljb25zL2ljb24tY2xvc2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyOCwgMTQpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuMTcyNzk2Niw1LjY2OTAwNjg2IEMyNS41NDU1MDc1LDUuMjk2Mjk1OTYgMjYuMTQ5NzkxMyw1LjI5NjI5NTk2IDI2LjUyMjUwMjIsNS42NjkwMDY4NiBDMjYuODk1MjEzMSw2LjA0MTcxNzc2IDI2Ljg5NTIxMzEsNi42NDYwMDE1MyAyNi41MjI1MDIyLDcuMDE4NzEyNDQgTDcuNDY3ODM1MjQsMjYuMDczMzc5NCBDNy4wOTUxMjQzNCwyNi40NDYwOTAzIDYuNDkwODQwNTcsMjYuNDQ2MDkwMyA2LjExODEyOTY3LDI2LjA3MzM3OTQgQzUuNzQ1NDE4NzcsMjUuNzAwNjY4NSA1Ljc0NTQxODc3LDI1LjA5NjM4NDcgNi4xMTgxMjk2NywyNC43MjM2NzM4IEwyNS4xNzI3OTY2LDUuNjY5MDA2ODYgWiIgaWQ9IlBhdGgtMiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNS4xNzI3OTY2LDUuNjY5MDA2ODYgQzI1LjU0NTUwNzUsNS4yOTYyOTU5NiAyNi4xNDk3OTEzLDUuMjk2Mjk1OTYgMjYuNTIyNTAyMiw1LjY2OTAwNjg2IEMyNi44OTUyMTMxLDYuMDQxNzE3NzYgMjYuODk1MjEzMSw2LjY0NjAwMTUzIDI2LjUyMjUwMjIsNy4wMTg3MTI0NCBMNy40Njc4MzUyNCwyNi4wNzMzNzk0IEM3LjA5NTEyNDM0LDI2LjQ0NjA5MDMgNi40OTA4NDA1NywyNi40NDYwOTAzIDYuMTE4MTI5NjcsMjYuMDczMzc5NCBDNS43NDU0MTg3NywyNS43MDA2Njg1IDUuNzQ1NDE4NzcsMjUuMDk2Mzg0NyA2LjExODEyOTY3LDI0LjcyMzY3MzggTDI1LjE3Mjc5NjYsNS42NjkwMDY4NiBaIiBpZD0iUGF0aC0yLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjMyMDMsIDE1Ljg3MTIpIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTE2LjMyMDMsIC0xNS44NzEyKSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
}

.ox-annotations > .ox-no-datasheet > p {
    margin: 0;
}

.ox-annotations > div.ox-no-datasheet > img {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}
.ox-annotations > img {
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
}


@media (min-width: 800px) {
    .ox-datasheet {
        top: 0px;
        width: 390px;
        background-color: white;
        padding: 15px 30px;
        overflow-y: auto;
        -webkit-animation: none;
        animation: none;
    }

    .ox-datasheet__header div img:first-child {
        pointer-events: none;
        display: none;
    }

    .ox-image-preview {
        padding: 72px;
    }

    .ox-image-preview--vertical {
        width: auto;
        height: -webkit-fill-available;
    }

    .ox-image-preview--horizontal {
        height: -webkit-fill-available;
        width: auto;
    }
}
`;
 
export default DEFAULT_CSS;