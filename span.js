window.onload = function () {

  const spacing = 12;
  const canvasSize = 250;

  const origin = {
    x: 5 * spacing,
    y: Math.floor(canvasSize / 2 / spacing) * spacing
  };

  const canvasIds = ['planeCanvas', 'vectorCanvas'];

  const canvases = {};
  canvasIds.forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      canvas.width = canvas.height = canvasSize;
      canvases[id] = {
        canvas,
        ctx: canvas.getContext('2d')
      };
    }
  });

  const coordText = document.getElementById('note2');

  // 🔥 STORE SELECTED POINT
  let selectedPoint = null;
  let selectedCoord = null;

  // 🔹 GRID
  const drawGrid = (ctx) => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.beginPath();

    for (let i = 0; i <= canvasSize; i += spacing) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasSize);
      ctx.moveTo(0, i);
      ctx.lineTo(canvasSize, i);
    }
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '9px Arial';

    for (let i = 0; i <= canvasSize; i += spacing) {
      const xVal = ((i - origin.x) / spacing);
      if (Math.abs(xVal) < 0.01) continue;
      ctx.fillText(xVal.toFixed(0), i - 6, origin.y + 12);
    }

    for (let i = 0; i <= canvasSize; i += spacing) {
      const yVal = ((origin.y - i) / spacing);
      if (Math.abs(yVal) < 0.01) continue;
      ctx.fillText(yVal.toFixed(0), origin.x + 4, i + 3);
    }
  };

  // 🔹 AXES
  const drawAxes = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, canvasSize);
    ctx.moveTo(0, origin.y);
    ctx.lineTo(canvasSize, origin.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // 🔹 POINT
  const drawPoint = (ctx, x, y, color = 'green') => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  // 🔥 INFINITE LINE
  const drawInfiniteLine = (ctx, x, y) => {

    const dx = x - origin.x;
    const dy = y - origin.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const extend = 1000;

    const x1 = origin.x - unitX * extend;
    const y1 = origin.y - unitY * extend;

    const x2 = origin.x + unitX * extend;
    const y2 = origin.y + unitY * extend;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // 🔹 ORIGIN LABEL
  const labelOrigin = (ctx) => {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 10px Arial';
    ctx.fillText("(0,0)", origin.x - 20, origin.y - 5);
  };

  // 🔹 DRAW ALL
  const drawAll = () => {
    for (const id in canvases) {
      const ctx = canvases[id].ctx;
      drawGrid(ctx);
      drawAxes(ctx);
    }
  };

  // 🔥 CLICK EVENT (ONLY SELECT)
  if (canvases['planeCanvas']) {
    canvases['planeCanvas'].canvas.addEventListener('click', (e) => {

      const rect = canvases['planeCanvas'].canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      drawAll();

      // store
      selectedPoint = { x, y };

      const xCoord = ((x - origin.x) / spacing).toFixed(2);
      const yCoord = ((origin.y - y) / spacing).toFixed(2);
      selectedCoord = { xCoord, yCoord };

      // FIRST GRAPH
      const ctx1 = canvases['planeCanvas'].ctx;
      drawPoint(ctx1, x, y);

    });
  }

  // 🔥 SUBMIT FUNCTION
  window.submitPoint = function () {

    if (!selectedPoint) {
      alert("Please select a point first!");
      return;
    }

    const { x, y } = selectedPoint;
    const { xCoord, yCoord } = selectedCoord;

    const ctx = canvases['vectorCanvas'].ctx;

    drawGrid(ctx);
    drawAxes(ctx);

    drawInfiniteLine(ctx, x, y);
    drawPoint(ctx, x, y, 'green');
    drawPoint(ctx, origin.x, origin.y, 'blue');
    labelOrigin(ctx);

    coordText.innerHTML =  `
        <b></b> <i>S</i> = { (${xCoord}, ${yCoord}) }
      `;
  };

  drawAll();
};