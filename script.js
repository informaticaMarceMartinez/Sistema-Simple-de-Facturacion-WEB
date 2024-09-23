const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('factura-form');
    const itemsContainer = document.getElementById('items');
    const agregarItemBtn = document.getElementById('agregar-item');
    const totalAmount = document.getElementById('total-amount');
    const botonImprimir = document.getElementById('imprimir');

    agregarItemBtn.addEventListener('click', agregarItem);
    itemsContainer.addEventListener('input', actualizarSubtotales);
    botonImprimir.addEventListener('click', imprimirDocumento);

    // Agregar el primer item al cargar la página
    agregarItem();

    function agregarItem() {
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.innerHTML = `
            <input type="text" class="descripcion" placeholder="Descripción" required>
            <input type="number" class="cantidad" placeholder="Cantidad" value="1" min="1" required>
            <input type="number" class="precio" placeholder="Precio" step="1" required>
            <select class="iva">
                <option value="21">21%</option>
                <option value="10">10%</option>
                <option value="4">4%</option>
                <option value="0">0%</option>
            </select>
            <span class="subtotal">0.00</span>
            <button type="button" class="eliminar-item">Borrar</button>
        `;
        itemsContainer.appendChild(newItem);

        newItem.querySelector('.eliminar-item').addEventListener('click', function() {
            itemsContainer.removeChild(newItem);
            actualizarSubtotales();
        });
    }

    function actualizarSubtotales() {
        let total = 0;
        const items = itemsContainer.getElementsByClassName('item');
        
        for (let item of items) {
            const cantidad = parseFloat(item.querySelector('.cantidad').value) || 0;
            const precio = parseFloat(item.querySelector('.precio').value) || 0;
            const iva = parseFloat(item.querySelector('.iva').value) || 0;
            const subtotal = cantidad * precio * (1 + iva / 100);
            item.querySelector('.subtotal').textContent = subtotal.toFixed(2);
            total += subtotal;
        }
        
        totalAmount.textContent = total.toFixed(2);
    }

    function imprimirDocumento() {
        const tipoDocumento = document.getElementById('tipo-documento').value;
        
        if (tipoDocumento === 'Factura Contado') {
            generarPDFFactura();
        } else if (tipoDocumento === 'Presupuesto') {
            generarPDFPresupuesto();
        } else {
            alert('Tipo de documento no válido');
        }
    }

    function generarPDFFactura() {
        const doc = new jsPDF();

        doc.format = 'a4'; // formato de página: 'a4'

        // Añadir el Logo de la empresa a la Factura
       /* let img = loadImage('logoVivero2.png');
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let dataUrl = canvas.toDataURL('image/png'); */
        
      /*  let imageUrl = 'logoVivero2.png';
        doc.addImage(imageUrl, 'PNG', 10, 10, 180, 160);
        */

      /*  var image1 = new Image();
        image1.src = "logoVivero2.jpeg";
        doc.addImage(image1, 'JPEG', 2, 2, 160, 100); */

        let img = new Image();
        
        img.onload = function() {
            img.src = 'logo.png';
          /*  doc.addImage(this, 'PNG', 20, 20, 280, 220); */
            doc.addImage('logo.png', 'PNG', 20, 20, 280, 220);
        };

        // Añadir rectangulos con colores de fondo
        doc.setFillColor(120, 188, 233);
        doc.rect(18, 35, 67, 30, 'F');

        doc.setFillColor(211, 233, 248);
        doc.rect(108, 35, 84, 30, 'F');

        doc.setFillColor(168, 240, 138);
        doc.rect(0, 0, 280, 25, 'F');
        doc.rect(0, 273, 360, 45, 'F');

        // Añadir encabezado
        doc.setFontSize(12);
       // doc.setFont('verdana', 'bold')
        doc.text(`FACTURA CONTADO`, 110, 40);

        doc.setTextColor(100, 100, 200);
        doc.text(`FACTURA CONTADO`, 110.3, 40.3);

        // Titulo del Documento
        doc.setFontSize(21);
        doc.setTextColor(0, 0, 0);
        doc.text(`Nombre de la Empresa`, 105, 16, null, null, 'center');
        
        // Datos de la EMPRESA
        doc.setFontSize(11);
        doc.text(`John xxx`, 20, 40);
        doc.text(`RUT Nº: 0123456789`, 20, 45);
        doc.text(`Dir.: Calle de la empresa 123 piso 6`, 20, 50);
        doc.text(`Madrid España`, 20, 55);
        doc.text(`Tel.: 555 555 555`, 20, 60);
        
        // Datos del cliente y fecha
        doc.setFontSize(11);
        doc.text(`Cliente: ${document.getElementById('cliente').value}`, 110, 55);
        doc.text(`Fecha: ${document.getElementById('fecha').value}`, 110, 60);
        doc.text(`Número: ${document.getElementById('numero').value}`, 110, 50);
        
        // Tabla de items
        let y = 80;
        doc.line(20, y, 190, y);
        y += 10;
        doc.text('Descripción', 20, y);
        doc.text('Cantidad', 80, y);
        doc.text('Precio', 110, y);
        doc.text('IVA', 140, y);
        doc.text('Subtotal', 170, y);
        y += 10;

        doc.line(20, y, 190, y);
        y += 10;
        
        const items = itemsContainer.getElementsByClassName('item');
        for (let item of items) {
            const descripcion = item.querySelector('.descripcion').value;
            const cantidad = item.querySelector('.cantidad').value;
            const precio = item.querySelector('.precio').value;
            const iva = item.querySelector('.iva').value;
            const subtotal = item.querySelector('.subtotal').textContent;
            
            doc.text(descripcion, 20, y);
            doc.text(cantidad, 80, y);
            doc.text(precio, 110, y);
            doc.text(`${iva}%`, 140, y);
            doc.text(subtotal, 170, y);
            
            y += 10;
        }
        
        s = y;
        s++;
        // Total
        doc.line(20, y, 190, y);
        doc.setFillColor(120, 188, 233);
        doc.line(20, s, 190, s);

        y += 10;

        doc.setFontSize(13);
        doc.text(`Total:  ${totalAmount.textContent} €`, 155, y);

        // Lineas fin y Cuenta Bancaria
        doc.setFontSize(12);
        doc.line(20, 278, 190, 278);
        doc.text(`Ingreso en Cuenta: ES 22 0182 3074 6122 5555 5555`, 105, 283, null, null, 'center');
        doc.line(20, 286, 190, 286);
    
        // Guardar el PDF
        doc.save('factura' + document.getElementById('numero').value + '.pdf');
    }

    function generarPDFPresupuesto() {
        const doc = new jsPDF();

        doc.format = 'a4'; // formato de página: 'a4'

        // Añadir rectangulos con colores de fondo
        doc.setFillColor(120, 188, 233);
        doc.rect(18, 35, 67, 30, 'F');

        doc.setFillColor(211, 233, 248);
        doc.rect(108, 35, 84, 30, 'F');

        doc.setFillColor(168, 240, 138);
        doc.rect(0, 0, 280, 25, 'F');
        doc.rect(0, 273, 360, 45, 'F');

        // Añadir encabezado
        doc.setFontSize(12);
        doc.text(`PRESUPUESTO`, 110, 40);
        doc.setTextColor(100, 100, 200);
        doc.text(`PRESUPUESTO`, 110.3, 40.3);

        // Titulo del Documento
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);

        doc.text(`Nombre de la Empresa`, 105, 16, null, null, 'center');
        
        // Datos de la EMPRESA
        doc.setFontSize(11);
        doc.text(`John xxx`, 20, 40);
        doc.text(`RUT Nº: 0123456789`, 20, 45);
        doc.text(`Dir.: Calle de la empresa 123 piso 6`, 20, 50);
        doc.text(`Madrid España`, 20, 55);
        doc.text(`Tel.: 555 555 555`, 20, 60);

        // Datos del cliente y fecha
        doc.setFontSize(11);
        doc.text(`Cliente: ${document.getElementById('cliente').value}`, 110, 55);
        doc.text(`Fecha: ${document.getElementById('fecha').value}`, 110, 60);
        doc.text(`Número: ${document.getElementById('numero').value}`, 110, 50);
        
        // Tabla de items
        let y = 80;
        doc.line(20, y, 190, y);
        y += 10;
        doc.text('Descripción', 20, y);
        doc.text('Cantidad', 80, y);
        doc.text('Precio', 110, y);
        doc.text('IVA', 140, y);
        doc.text('Subtotal', 170, y);
        y += 10;
        doc.line(20, y, 190, y);
        y += 10;
        
        const items = itemsContainer.getElementsByClassName('item');
        for (let item of items) {
            const descripcion = item.querySelector('.descripcion').value;
            const cantidad = item.querySelector('.cantidad').value;
            const precio = item.querySelector('.precio').value;
            const iva = item.querySelector('.iva').value;
            const subtotal = item.querySelector('.subtotal').textContent;
            
            doc.text(descripcion, 20, y);
            doc.text(cantidad, 80, y);
            doc.text(precio, 110, y);
            doc.text(`${iva}%`, 140, y);
            doc.text(subtotal, 170, y);
            
            y += 10;
        }
        
        s = y;
        s++;

        // Total
        doc.line(20, y, 190, y);
        doc.setFillColor(120, 188, 233);
        doc.line(20, s, 190, s);
        
        y += 10;
        doc.setFontSize(13);
        doc.text(`Total:  ${totalAmount.textContent} €`, 155, y);
        
        // Nota adicional para presupuesto
        y += 20;
        doc.setFontSize(9);
        doc.text('** Este presupuesto, es válido por 30 días.', 20, y);

        // Lineas fin y Cuenta Bancaria
        doc.setFontSize(12);
      //  doc.line(20, 275, 190, 275);
      //  doc.text(`Ingreso en Cuenta: ES 52 0182 3974 6102 0159 5582`, 105, 280, null, null, 'center');
        doc.line(20, 283, 190, 283);
        
        // Guardar el PDF
        doc.save('presupuesto' + document.getElementById('numero').value + '.pdf');
    }
});
