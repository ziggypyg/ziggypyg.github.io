# Catálogo Ziggy

Lápices, puntas y accesorios para tablet y celular. Pedidos por WhatsApp 0984 488 787 · Instagram @ziggy.py

## Páginas por producto

La guía de pedido está aparte, en `como-pedir/`. Cada producto tiene su propia página en `p/<id>/` (por ejemplo `p/lapiz-ipad/`), con su foto y nombre en la vista previa de WhatsApp.
Se generan desde el `CATALOG` de `index.html`. Después de cualquier cambio en el catálogo, correr:

    node tools/build-productos.js
