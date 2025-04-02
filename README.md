# Manifest V3, background scripts, popup UI, storage

## Pop up appearing HTML && CSS && JavaScript
you have 3 diff contexts that define what you are able to do.
1. The Popup is the first context - so the DOM available is the Popup it self.
2. the second context is the *service-worker*
###  3. Page context (Content script) => reading the actual content of the page itself
Content scripts are files that run in the context of web pages. Using the standard Document Object Model (DOM), they are able to read details of the web pages the browser visits, make changes to them, and pass information to their parent extension.



npm run build - dist => will be serve as a the chrome extension files

dist files will dictate the flow: 
index.html can be the popup => manifest set rules


TAB || WINDOW: 

En Chrome, un tab representa una pestaña individual, es decir, una instancia de una página web con propiedades como:

id: Identificador único de la pestaña.

windowId: ID de la ventana a la que pertenece.

index: Posición de la pestaña en la ventana.

url, title, favIconUrl, etc.

Mientras que un window es la ventana del navegador en sí, que puede contener múltiples pestañas. Sus propiedades incluyen:

id: Identificador único de la ventana.

focused: Indica si la ventana está enfocada.

state: Estado de la ventana (minimizada, maximizada, normal).

type: Tipo de ventana (normal, popup, etc.).

incognito: Si es una ventana de navegación privada.
