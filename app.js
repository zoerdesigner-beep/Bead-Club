const MAX_FILE_SIZE = 10 * 1024 * 1024;
const WIDTH_MIN = 8;
const WIDTH_MAX = 200;
const HISTORY_DB_NAME = "perler-bead-history";
const HISTORY_STORE = "entries";
const RETENTION_GENERATED_MS = 7 * 24 * 60 * 60 * 1000;
const RETENTION_EDITED_MS = 30 * 24 * 60 * 60 * 1000;
const VIEW_SESSION_KEY = "bead-club-view-session";

const state = {
  palette: [],
  image: null,
  imageFile: null,
  sourceUrl: "",
  sourceCrop: null,
  pattern: null,
  activeView: "home",
  historyEntryId: null,
  reopenMode: null,
  editor: {
    enabled: false,
    activeTool: "paint",
    selectedColor: null,
    zoom: 1,
    showCodes: true,
    showGrid: true,
    showSourceUnderlay: false,
    showPixels: true,
    colorMode: "used",
    history: [],
    future: [],
    selection: null,
    dragStart: null,
    hoverCell: null,
    mergeFromCode: null,
    mergeToCode: null,
    mergePickTarget: null,
    strokeActive: false,
    lastPaintedIndex: -1,
    spacePanning: false,
    isPanning: false,
    panPointerId: null,
    panStart: null,
    paletteHidden: false,
    sourcePreviewZoom: 1,
  },
};

const EDITOR_ZOOM_MIN = 0.25;
const EDITOR_ZOOM_MAX = 4;
const EDITOR_TOOL_SHORTCUTS = {
  b: "paint",
  e: "eraser",
  i: "picker",
  f: "fill",
  s: "select",
};

const els = {
  homeView: document.querySelector("#homeView"),
  workspaceView: document.querySelector("#workspaceView"),
  editorView: document.querySelector("#editorView"),
  siteFooter: document.querySelector("#siteFooter"),
  homeNavBtn: document.querySelector("#homeNavBtn"),
  historyNavBtn: document.querySelector("#historyNavBtn"),
  historyView: document.querySelector("#historyView"),
  historyList: document.querySelector("#historyList"),
  historyEmpty: document.querySelector("#historyEmpty"),
  historyBackBtn: document.querySelector("#historyBackBtn"),
  newProjectBtn: document.querySelector("#newProjectBtn"),
  recentPatternsRow: document.querySelector("#recentPatternsRow"),
  viewAllPatternsBtn: document.querySelector("#viewAllPatternsBtn"),
  edPaletteFloat: document.querySelector("#edPaletteFloat"),
  edPaletteControls: document.querySelector("#edPaletteControls"),
  paletteShowTab: document.querySelector("#paletteShowTab"),
  guideNavBtn: document.querySelector("#guideNavBtn"),
  startWorkspaceBtn: document.querySelector("#startWorkspaceBtn"),
  heroBadgeBtn: document.querySelector("#heroBadgeBtn"),
  scrollGuideBtn: document.querySelector("#scrollGuideBtn"),
  backToWorkspaceBtn: document.querySelector("#backToWorkspaceBtn"),
  imageInput: document.querySelector("#imageInput"),
  dropZone: document.querySelector("#dropZone"),
  fileMeta: document.querySelector("#fileMeta"),
  sourcePreview: document.querySelector("#sourcePreview"),
  sourceEmpty: document.querySelector("#sourceEmpty"),
  widthSlider: document.querySelector("#widthSlider"),
  widthInput: document.querySelector("#widthInput"),
  colorLimit: document.querySelector("#colorLimit"),
  colorMergeLevel: document.querySelector("#colorMergeLevel"),
  colorMergeValue: document.querySelector("#colorMergeValue"),
  edgeEnhanceLevel: document.querySelector("#edgeEnhanceLevel"),
  edgeEnhanceValue: document.querySelector("#edgeEnhanceValue"),
  outlineEnabled: document.querySelector("#outlineEnabled"),
  outlineColorRow: document.querySelector("#outlineColorRow"),
  outlineColorSelect: document.querySelector("#outlineColorSelect"),
  generateBtn: document.querySelector("#generateBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  statusMessage: document.querySelector("#statusMessage"),
  patternCanvas: document.querySelector("#patternCanvas"),
  editorCanvas: document.querySelector("#editorCanvas"),
  editorCanvasBody: document.querySelector("#editorCanvasBody"),
  editorCanvasWrap: document.querySelector(".ed-canvas-wrap"),
  editorEmpty: document.querySelector("#editorEmpty"),
  patternEmpty: document.querySelector("#patternEmpty"),
  patternMeta: document.querySelector("#patternMeta"),
  summaryStats: document.querySelector("#summaryStats"),
  materialsTable: document.querySelector("#materialsTable"),
  downloadBtn: document.querySelector("#downloadBtn"),
  dither: document.querySelector("#dither"),
  editToggleBtn: document.querySelector("#editToggleBtn"),
  customDrawBtn: document.querySelector("#customDrawBtn"),
  editorTools: Array.from(document.querySelectorAll("#editorView [data-tool]")),
  undoBtn: document.querySelector("#undoBtn"),
  redoBtn: document.querySelector("#redoBtn"),
  zoomSelect: document.querySelector("#zoomSelect"),
  showCodes: document.querySelector("#showCodes"),
  showGrid: document.querySelector("#showGrid"),
  showSourceUnderlay: document.querySelector("#showSourceUnderlay"),
  showPixels: document.querySelector("#showPixels"),
  hoverInfo: document.querySelector("#hoverInfo"),
  edMain: document.querySelector("#edMain"),
  edPalettePanel: document.querySelector("#edPalettePanel"),
  togglePaletteBtn: document.querySelector("#togglePaletteBtn"),
  sourcePreviewFloat: document.querySelector("#sourcePreviewFloat"),
  editorSourcePreview: document.querySelector("#editorSourcePreview"),
  sourcePreviewZoomBtn: document.querySelector("#sourcePreviewZoomBtn"),
  sourcePreviewModal: document.querySelector("#sourcePreviewModal"),
  editorSourcePreviewLarge: document.querySelector("#editorSourcePreviewLarge"),
  sourceModalViewport: document.querySelector("#sourceModalViewport"),
  sourceZoomLabel: document.querySelector("#sourceZoomLabel"),
  sourceZoomInBtn: document.querySelector("#sourceZoomInBtn"),
  sourceZoomOutBtn: document.querySelector("#sourceZoomOutBtn"),
  closeSourceModalBtn: document.querySelector("#closeSourceModalBtn"),
  canvasResizeBtn: document.querySelector("#canvasResizeBtn"),
  canvasResizePanel: document.querySelector("#canvasResizePanel"),
  resizeWidthInput: document.querySelector("#resizeWidthInput"),
  resizeHeightInput: document.querySelector("#resizeHeightInput"),
  resizeAnchorSelect: document.querySelector("#resizeAnchorSelect"),
  applyResizeBtn: document.querySelector("#applyResizeBtn"),
  toggleMergePanelBtn: document.querySelector("#toggleMergePanelBtn"),
  mergePanel: document.querySelector("#mergePanel"),
  colorMode: document.querySelector("#colorMode"),
  colorSearch: document.querySelector("#colorSearch"),
  colorPalette: document.querySelector("#colorPalette"),
  applySelectionBtn: document.querySelector("#applySelectionBtn"),
  clearSelectionBtn: document.querySelector("#clearSelectionBtn"),
  clearColorBtn: document.querySelector("#clearColorBtn"),
  clearTinyBtn: document.querySelector("#clearTinyBtn"),
  mergeFromPick: document.querySelector("#mergeFromPick"),
  mergeToPick: document.querySelector("#mergeToPick"),
  mergeFromDisplay: document.querySelector("#mergeFromDisplay"),
  mergeToDisplay: document.querySelector("#mergeToDisplay"),
  mergeHint: document.querySelector("#mergeHint"),
  mergeColorsBtn: document.querySelector("#mergeColorsBtn"),
  editorDownloadBtn: document.querySelector("#editorDownloadBtn"),
  alphaModes: Array.from(document.querySelectorAll('input[name="alphaMode"]')),
  bgToleranceRow: document.querySelector("#bgToleranceRow"),
  bgToleranceLevel: document.querySelector("#bgToleranceLevel"),
  bgToleranceValue: document.querySelector("#bgToleranceValue"),
};

init();

async function init() {
  bindEvents();
  applyStoredViewShell();
  updateColorMergeLabel();
  updateEdgeEnhanceLabel();
  updateBgToleranceLabel();
  syncBgToleranceRow();
  updateWidthLabel();
  setStatus("正在加载 MARD 291 色板...");
  renderRecentNewCard();

  try {
    const response = await fetch("mard-291.json");
    if (!response.ok) {
      throw new Error("色板文件加载失败");
    }

    const data = await response.json();
    state.palette = data.colors.map((color) => {
      const c = { ...color, luminance: getLuminance(color.r, color.g, color.b) };
      ensureLab(c);
      return c;
    });
    populateOutlineColorSelect();
    syncOutlineColorRow();
    setStatus("上传一张图片，生成你的第一张拼豆图纸。");
    await initHistoryStore();
    await renderRecentPatterns();
    await restoreViewSession();
  } catch (error) {
    setStatus("MARD 291 色板加载失败，请确认 mard-291.json 位于网站根目录。", "error");
    console.error(error);
    await renderRecentPatterns();
    await restoreViewSession();
  }
}

function bindEvents() {
  bindNavigationEvents();

  try {
    bindWorkspaceEvents();
  } catch (error) {
    console.error("部分工作台事件绑定失败，新建图纸等基础导航仍可用。", error);
  }
}

function bindNavigationEvents() {
  els.homeNavBtn?.addEventListener("click", () => setView("home"));
  els.historyNavBtn?.addEventListener("click", () => setView("history"));
  els.viewAllPatternsBtn?.addEventListener("click", () => setView("history"));
  els.recentPatternsRow?.addEventListener("click", handleRecentPatternsClick);
  els.historyBackBtn?.addEventListener("click", () => setView("home"));
  els.newProjectBtn?.addEventListener("click", startNewProject);
  els.guideNavBtn?.addEventListener("click", () => {
    setView("home");
    document.querySelector("#guide")?.scrollIntoView({ behavior: "smooth" });
  });
  els.startWorkspaceBtn?.addEventListener("click", startNewProject);
  els.heroBadgeBtn?.addEventListener("click", startNewProject);
  els.scrollGuideBtn?.addEventListener("click", () => {
    document.querySelector("#guide")?.scrollIntoView({ behavior: "smooth" });
  });
  window.addEventListener("scroll", syncHomeTopbarTheme, { passive: true });
  window.addEventListener("resize", syncHomeTopbarTheme);
  els.backToWorkspaceBtn?.addEventListener("click", handleEditorBack);
}

function bindWorkspaceEvents() {
  els.imageInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) {
      handleFile(file);
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("drag-over");
    });
  });

  els.dropZone.addEventListener("drop", (event) => {
    const [file] = event.dataTransfer.files;
    if (file) {
      handleFile(file);
    }
  });

  els.widthSlider.addEventListener("input", () => {
    syncWidthControls();
    updateEstimate();
    markResultStale();
  });
  els.widthInput?.addEventListener("change", applyWidthInput);
  els.widthInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      applyWidthInput();
      els.widthInput.blur();
    }
  });

  els.colorLimit.addEventListener("change", markResultStale);
  els.colorMergeLevel.addEventListener("input", () => {
    updateColorMergeLabel();
    markResultStale();
  });
  els.edgeEnhanceLevel.addEventListener("input", () => {
    updateEdgeEnhanceLabel();
    markResultStale();
  });
  els.outlineEnabled.addEventListener("change", () => {
    syncOutlineColorRow();
    markResultStale();
  });
  els.outlineColorSelect?.addEventListener("change", markResultStale);
  els.dither.addEventListener("change", markResultStale);
  els.alphaModes.forEach((radio) => {
    radio.addEventListener("change", () => {
      syncBgToleranceRow();
      markResultStale();
    });
  });
  els.bgToleranceLevel?.addEventListener("input", () => {
    updateBgToleranceLabel();
    markResultStale();
  });
  els.generateBtn.addEventListener("click", generatePattern);
  els.downloadBtn.addEventListener("click", downloadPattern);
  els.editorDownloadBtn.addEventListener("click", downloadPattern);
  els.resetBtn.addEventListener("click", resetTool);
  els.editToggleBtn.addEventListener("click", enterEditorView);
  els.customDrawBtn.addEventListener("click", startCustomDrawing);
  els.editorTools.forEach((button) => {
    button.addEventListener("click", () => setEditorTool(button.dataset.tool));
  });
  els.togglePaletteBtn?.addEventListener("click", togglePalettePanel);
  els.paletteShowTab?.addEventListener("click", togglePalettePanel);
  els.sourcePreviewZoomBtn?.addEventListener("click", openSourcePreviewModal);
  els.editorSourcePreview?.addEventListener("click", openSourcePreviewModal);
  els.closeSourceModalBtn?.addEventListener("click", closeSourcePreviewModal);
  els.sourcePreviewModal?.querySelector("[data-close-modal]")?.addEventListener("click", closeSourcePreviewModal);
  els.sourceZoomInBtn?.addEventListener("click", () => adjustSourcePreviewZoom(1.2));
  els.sourceZoomOutBtn?.addEventListener("click", () => adjustSourcePreviewZoom(1 / 1.2));
  els.sourceModalViewport?.addEventListener("wheel", handleSourceModalWheel, { passive: false });
  els.canvasResizeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleEditorPopover(els.canvasResizePanel);
  });
  els.toggleMergePanelBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleEditorPopover(els.mergePanel);
  });
  els.applyResizeBtn?.addEventListener("click", applyCanvasResize);
  document.addEventListener("click", closeEditorPopoversOnOutsideClick);
  els.undoBtn.addEventListener("click", undoEdit);
  els.redoBtn.addEventListener("click", redoEdit);
  els.zoomSelect.addEventListener("change", applyEditorZoom);
  els.showCodes.addEventListener("change", () => {
    state.editor.showCodes = els.showCodes.checked;
    renderPreview(state.pattern);
  });
  els.showGrid.addEventListener("change", () => {
    state.editor.showGrid = els.showGrid.checked;
    renderPreview(state.pattern);
  });
  els.showSourceUnderlay?.addEventListener("change", () => {
    state.editor.showSourceUnderlay = els.showSourceUnderlay.checked;
    renderPreview(state.pattern);
  });
  els.showPixels?.addEventListener("change", () => {
    state.editor.showPixels = els.showPixels.checked;
    renderPreview(state.pattern);
  });
  els.colorMode.addEventListener("change", () => {
    state.editor.colorMode = els.colorMode.value;
    renderEditorPalette();
  });
  els.colorSearch.addEventListener("input", renderEditorPalette);
  els.applySelectionBtn.addEventListener("click", applySelectionPaint);
  els.clearSelectionBtn.addEventListener("click", clearSelection);
  els.clearColorBtn?.addEventListener("click", clearSelectedColor);
  els.clearTinyBtn.addEventListener("click", cleanupTinyRegions);
  els.mergeFromPick.addEventListener("click", () => setMergePickTarget("from"));
  els.mergeToPick.addEventListener("click", () => setMergePickTarget("to"));
  els.mergeColorsBtn.addEventListener("click", mergeColorsBySelection);
  bindEditorViewportEvents();
  els.editorCanvas.addEventListener("pointerdown", handleCanvasPointerDown);
  els.editorCanvas.addEventListener("pointermove", handleCanvasPointerMove);
  els.editorCanvas.addEventListener("pointerup", handleCanvasPointerUp);
  els.editorCanvas.addEventListener("pointerleave", handleCanvasPointerLeave);
}

function bindEditorViewportEvents() {
  if (!els.editorCanvasBody) return;

  els.editorCanvasBody.addEventListener("wheel", handleEditorWheel, { passive: false });
  els.editorCanvasBody.addEventListener("pointerdown", handleViewportPointerDown);
  els.editorCanvasBody.addEventListener("pointermove", handleViewportPointerMove);
  els.editorCanvasBody.addEventListener("pointerup", handleViewportPointerUp);
  els.editorCanvasBody.addEventListener("pointercancel", handleViewportPointerUp);
  els.editorCanvasBody.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });

  window.addEventListener("keydown", handleEditorKeyDown);
  window.addEventListener("keyup", handleEditorKeyUp);
}

function isEditorInteractionActive() {
  return state.editor.enabled && state.activeView === "editor";
}

function shouldStartCanvasPan(event) {
  if (!isEditorInteractionActive()) return false;
  if (event.button === 1) return true;
  return event.button === 0 && state.editor.spacePanning;
}

function startCanvasPan(event) {
  const body = els.editorCanvasBody;
  if (!body) return;

  state.editor.isPanning = true;
  state.editor.panPointerId = event.pointerId;
  state.editor.panStart = {
    x: event.clientX,
    y: event.clientY,
    scrollLeft: body.scrollLeft,
    scrollTop: body.scrollTop,
  };

  body.classList.add("panning");
  body.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function updateCanvasPan(event) {
  if (!state.editor.isPanning || !state.editor.panStart || !els.editorCanvasBody) return;
  if (event.pointerId !== state.editor.panPointerId) return;

  const dx = event.clientX - state.editor.panStart.x;
  const dy = event.clientY - state.editor.panStart.y;
  els.editorCanvasBody.scrollLeft = state.editor.panStart.scrollLeft - dx;
  els.editorCanvasBody.scrollTop = state.editor.panStart.scrollTop - dy;
  event.preventDefault();
}

function endCanvasPan(event) {
  if (!state.editor.isPanning) return;
  if (event && event.pointerId !== state.editor.panPointerId) return;

  state.editor.isPanning = false;
  state.editor.panPointerId = null;
  state.editor.panStart = null;
  els.editorCanvasBody?.classList.remove("panning");
  if (event && els.editorCanvasBody?.hasPointerCapture(event.pointerId)) {
    els.editorCanvasBody.releasePointerCapture(event.pointerId);
  }
}

function updateEditorPanCursor() {
  const body = els.editorCanvasBody;
  if (!body) return;
  body.classList.toggle("pan-ready", isEditorInteractionActive() && state.editor.spacePanning && !state.editor.isPanning);
}

function isTypingField(target) {
  const tag = target?.tagName;
  if (target?.isContentEditable) return true;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag !== "INPUT") return false;

  const type = (target.getAttribute("type") || "text").toLowerCase();
  return ["text", "number", "search", "email", "password", "url", "tel"].includes(type);
}

function handleEditorKeyDown(event) {
  const inField = isTypingField(event.target);

  if (isEditorInteractionActive() && !inField) {
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
      event.preventDefault();
      undoEdit();
      return;
    }
    if (mod && (event.key.toLowerCase() === "y" || (event.key.toLowerCase() === "z" && event.shiftKey))) {
      event.preventDefault();
      redoEdit();
      return;
    }

    if (!mod && !event.altKey && !event.shiftKey) {
      const tool = EDITOR_TOOL_SHORTCUTS[event.key.toLowerCase()];
      if (tool) {
        event.preventDefault();
        setEditorTool(tool);
        return;
      }
    }
  }

  if (!isEditorInteractionActive()) return;
  if (event.code !== "Space" || event.repeat) return;
  if (inField) return;

  event.preventDefault();
  state.editor.spacePanning = true;
  updateEditorPanCursor();
}

function handleEditorKeyUp(event) {
  if (event.code !== "Space") return;
  state.editor.spacePanning = false;
  endCanvasPan();
  updateEditorPanCursor();
}

function handleEditorWheel(event) {
  if (!isEditorInteractionActive()) return;

  event.preventDefault();
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  setEditorZoomValue(state.editor.zoom * factor);
}

function handleViewportPointerDown(event) {
  if (event.target !== els.editorCanvasBody) return;
  if (!shouldStartCanvasPan(event)) return;
  startCanvasPan(event);
}

function handleViewportPointerMove(event) {
  if (state.editor.isPanning) {
    updateCanvasPan(event);
    return;
  }
}

function handleViewportPointerUp(event) {
  endCanvasPan(event);
}

function syncZoomSelectFromValue() {
  if (!els.zoomSelect) return;

  const zoom = state.editor.zoom;
  const fitZoom = computeFitEditorZoom();
  if (Math.abs(zoom - fitZoom) < 0.04) {
    els.zoomSelect.value = "fit";
    return;
  }

  const preset = Array.from(els.zoomSelect.options)
    .map((option) => option.value)
    .filter((value) => value !== "fit")
    .reduce((best, value) => {
      const diff = Math.abs(Number(value) - zoom);
      return diff < best.diff ? { value, diff } : best;
    }, { value: "1", diff: Infinity });

  els.zoomSelect.value = preset.value;
}

function setEditorZoomValue(zoom) {
  if (!state.pattern) return;

  state.editor.zoom = Math.max(EDITOR_ZOOM_MIN, Math.min(EDITOR_ZOOM_MAX, zoom));
  syncZoomSelectFromValue();

  if (state.editor.enabled) {
    renderPreview(state.pattern);
  }
}

function setView(view, options = {}) {
  const { persist = true } = options;
  state.activeView = view;
  els.homeView.hidden = view !== "home";
  els.workspaceView.hidden = view !== "workspace";
  els.historyView.hidden = view !== "history";
  els.editorView.hidden = view !== "editor";
  els.siteFooter.hidden = view === "editor" || view === "workspace";
  document.body.classList.toggle("is-editor", view === "editor");
  els.historyNavBtn?.classList.toggle("active", view === "history");
  window.scrollTo(0, 0);

  if (view === "home") {
    void renderRecentPatterns();
  }

  if (view === "history") {
    renderHistoryView();
  }

  if (view === "editor") {
    renderPreview(state.pattern);
  } else if (view !== "editor" && state.editor.enabled) {
    exitEditorView();
  }

  syncHomeTopbarTheme();

  if (persist) {
    saveViewSession();
  }
}

function getViewSession() {
  try {
    const raw = sessionStorage.getItem(VIEW_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveViewSession() {
  try {
    sessionStorage.setItem(VIEW_SESSION_KEY, JSON.stringify({
      view: state.activeView,
      historyEntryId: state.historyEntryId || null,
    }));
  } catch (error) {
    console.error(error);
  }
}

function applyStoredViewShell() {
  const session = getViewSession();
  if (!session?.view || session.view === "home") return;
  if (!["workspace", "history", "editor"].includes(session.view)) return;

  setView(session.view, { persist: false });
}

async function restoreViewSession() {
  const session = getViewSession();
  if (!session?.view || session.view === "home") {
    setView("home", { persist: false });
    saveViewSession();
    return;
  }

  if (session.view === "history") {
    setView("history", { persist: false });
    saveViewSession();
    return;
  }

  if (session.historyEntryId) {
    const entry = await historyGet(session.historyEntryId);
    if (!entry || isHistoryEntryExpired(entry)) {
      if (entry) {
        await historyDelete(entry.id);
      }
      clearHistorySession();
      setView("home", { persist: false });
      saveViewSession();
      setStatus("上次打开的图纸已过期或不存在，已返回首页。", "error");
      return;
    }

    state.historyEntryId = session.historyEntryId;
    await loadHistoryEntry(entry);

    if (session.view === "editor") {
      enterEditorView({ restoring: true });
      saveViewSession();
      return;
    }

    setView("workspace", { persist: false });
    saveViewSession();
    return;
  }

  if (session.view === "editor") {
    setView("workspace", { persist: false });
  } else {
    setView(session.view, { persist: false });
  }
  saveViewSession();
}

function syncHomeTopbarTheme() {
  if (state.activeView !== "home") {
    document.body.classList.remove("home-topbar-solid");
    return;
  }

  const recentTop = els.recentPatternsRow?.closest(".home-recent")?.getBoundingClientRect().top;
  const threshold = 56;
  document.body.classList.toggle("home-topbar-solid", Number.isFinite(recentTop) && recentTop <= threshold);
}

async function handleFile(file) {
  clearPattern();

  if (!isSupportedImage(file)) {
    setStatus("请上传 JPG、PNG 或 WebP 图片。", "error");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setStatus("图片超过 10MB，请压缩后再上传。", "error");
    return;
  }

  try {
    const image = await loadImage(file);
    state.image = image;
    state.imageFile = file;
    state.sourceCrop = null;

    if (state.sourceUrl) {
      URL.revokeObjectURL(state.sourceUrl);
    }

    state.sourceUrl = URL.createObjectURL(file);
    els.sourcePreview.src = state.sourceUrl;
    els.sourcePreview.hidden = false;
    els.sourceEmpty.hidden = true;
    els.fileMeta.hidden = false;
    els.fileMeta.textContent = `${file.name} · ${image.naturalWidth} x ${image.naturalHeight} · ${formatBytes(file.size)}`;
    els.generateBtn.disabled = false;
    updateEstimate();
    setStatus("图片已上传。调整参数后点击“生成图纸”。", "success");
  } catch (error) {
    setStatus("图片解析失败，请换一张图片重试。", "error");
    console.error(error);
  }
}

function isSupportedImage(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    image.src = url;
  });
}

function updateEstimate() {
  if (!state.image) {
    els.generateBtn.disabled = true;
    return;
  }

  const width = getRequestedWidth();
  if (!Number.isFinite(width) || width < WIDTH_MIN || width > WIDTH_MAX) {
    els.generateBtn.disabled = true;
    return;
  }

  els.generateBtn.disabled = false;
}

function updateWidthLabel() {
  syncWidthControls();
}

function syncWidthControls() {
  if (!els.widthSlider) return;
  const value = els.widthSlider.value;
  if (els.widthInput) {
    els.widthInput.value = value;
  }
}

function applyWidthInput() {
  if (!els.widthInput || !els.widthSlider) return;

  let width = Number.parseInt(els.widthInput.value, 10);
  if (!Number.isFinite(width)) {
    width = Number.parseInt(els.widthSlider.value, 10);
  }
  width = Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, width));
  els.widthSlider.value = String(width);
  els.widthInput.value = String(width);
  updateEstimate();
  markResultStale();
}

function markResultStale() {
  updateEstimate();
  if (state.pattern) {
    setStatus("参数已变化，请重新生成图纸。");
    els.downloadBtn.disabled = true;
    disableEditor();
  }
}

async function generatePattern() {
  if (!state.image || state.palette.length === 0) {
    return;
  }

  const width = getRequestedWidth();
  if (!Number.isFinite(width) || width < WIDTH_MIN || width > WIDTH_MAX) {
    setStatus(`宽度格数需在 ${WIDTH_MIN} 到 ${WIDTH_MAX} 之间。`, "error");
    updateEstimate();
    return;
  }

  els.generateBtn.disabled = true;
  els.downloadBtn.disabled = true;
  setStatus("正在分析主体、裁剪留白并保护线稿...");

  await nextFrame();

  try {
    const alphaMode = getAlphaMode();
    const colorLimit = Number(els.colorLimit.value);
    const colorMergeLevel = Number(els.colorMergeLevel.value);
    const dither = els.dither.checked;
    const sampled = sampleIllustrationToGrid(state.image, width, alphaMode, getBgTolerance());
    state.sourceCrop = sampled.crop;
    if (sampled.width * sampled.height > 40000) {
      setStatus("当前图纸较大，生成可能较慢。", "error");
      await nextFrame();
    }
    const pattern = mapIllustrationGridToPalette(sampled, colorLimit, dither, colorMergeLevel, {
      enabled: els.outlineEnabled.checked,
      color: getSelectedOutlineColor(),
    });

    state.pattern = pattern;
    resetEditorForPattern(pattern);
    renderPreview(pattern);
    renderStats(pattern);
    renderEditorPalette();
    updateSourcePreviewFloat();
    els.downloadBtn.disabled = false;
    void saveHistoryAfterGenerate();

    const warning = buildResultWarning(pattern);
    setStatus(warning || "图纸生成成功，可以查看用料统计或下载 PNG。", warning ? "error" : "success");
  } catch (error) {
    setStatus("生成失败，请降低图纸尺寸或换一张图片重试。", "error");
    console.error(error);
  } finally {
    els.generateBtn.disabled = false;
  }
}

function sampleImageToGrid(image, width, height, alphaMode, bgTolerance = 35) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (alphaMode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;
  const rawPixels = [];
  const pixels = [];

  for (let i = 0; i < imageData.length; i += 4) {
    rawPixels.push({
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
      a: imageData[i + 3],
    });
  }

  const subjectBackground = alphaMode === "subject"
    ? detectEdgeConnectedBackground(rawPixels, width, height, bgTolerance)
    : null;

  for (let i = 0; i < rawPixels.length; i++) {
    const pixel = rawPixels[i];
    if ((alphaMode === "keep" || alphaMode === "subject") && pixel.a < 128) {
      pixels.push(null);
    } else if (subjectBackground?.[i]) {
      pixels.push(null);
    } else {
      pixels.push({
        r: pixel.r,
        g: pixel.g,
        b: pixel.b,
      });
    }
  }

  return pixels;
}

function sampleIllustrationToGrid(image, targetWidth, alphaMode, bgTolerance = 35) {
  const crop = detectIllustrationCrop(image, bgTolerance);
  const width = targetWidth;
  const height = Math.max(1, Math.round((crop.height / crop.width) * width));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (alphaMode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;
  const rawPixels = [];
  const inkMask = new Uint8Array(width * height);

  for (let i = 0; i < imageData.length; i += 4) {
    const pixel = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
      a: imageData[i + 3],
    };
    const idx = i / 4;
    rawPixels.push(pixel);
    if (isInkPixel(pixel)) {
      inkMask[idx] = 1;
    }
  }

  const background = alphaMode === "white"
    ? null
    : detectIllustrationBackground(rawPixels, width, height, bgTolerance, inkMask);
  const grid = rawPixels.map((pixel, index) => {
    if (pixel.a < 128) return null;
    if (background?.[index] && !inkMask[index]) return null;
    return { r: pixel.r, g: pixel.g, b: pixel.b };
  });

  return { grid, inkMask, width, height, crop };
}

function detectIllustrationCrop(image, toleranceLevel = 35) {
  const maxSide = 960;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.max(1, Math.round(image.naturalWidth * scale));
  const h = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(image, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const samples = [];
  const sampleAt = (x, y) => {
    const i = (y * w + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
  };
  const inset = Math.max(0, Math.min(8, Math.floor(Math.min(w, h) * 0.03)));
  samples.push(
    sampleAt(inset, inset),
    sampleAt(w - 1 - inset, inset),
    sampleAt(inset, h - 1 - inset),
    sampleAt(w - 1 - inset, h - 1 - inset),
  );
  const bg = averageRgba(samples);
  const level = Math.max(0, Math.min(100, Number(toleranceLevel) || 0));
  const bgTolSq = Math.pow(32 + level * 1.4, 2);
  let left = w;
  let right = -1;
  let top = h;
  let bottom = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pixel = sampleAt(x, y);
      if (pixel.a < 24) continue;
      const lum = getLuminance(pixel.r, pixel.g, pixel.b);
      const sat = getSaturation(pixel);
      const isLikelyBlank = rgbDistanceSq(pixel, bg) <= bgTolSq || (lum > 0.94 && sat < 0.08);
      if (isLikelyBlank && !isInkPixel(pixel)) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < left || bottom < top) {
    return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
  }

  const pad = Math.round(Math.max(right - left + 1, bottom - top + 1) * 0.08);
  left = Math.max(0, left - pad);
  right = Math.min(w - 1, right + pad);
  top = Math.max(0, top - pad);
  bottom = Math.min(h - 1, bottom + pad);

  return {
    x: Math.round(left / scale),
    y: Math.round(top / scale),
    width: Math.max(1, Math.round((right - left + 1) / scale)),
    height: Math.max(1, Math.round((bottom - top + 1) / scale)),
  };
}

function detectIllustrationBackground(pixels, width, height, toleranceLevel, inkMask) {
  const total = width * height;
  const background = new Uint8Array(total);
  const visited = new Uint8Array(total);
  const queue = [];
  const edgeSamples = [];
  const level = Math.max(0, Math.min(100, Number(toleranceLevel) || 0));
  const edgeToleranceSq = Math.pow(38 + level * 1.65, 2);
  const nearWhiteToleranceSq = Math.pow(24 + level * 0.7, 2);

  const pushSeed = (index) => {
    if (visited[index] || inkMask[index]) return;
    const pixel = pixels[index];
    if (pixel.a < 128) {
      visited[index] = 1;
      background[index] = 1;
      queue.push(index);
      return;
    }
    visited[index] = 1;
    background[index] = 1;
    queue.push(index);
    edgeSamples.push(pixel);
  };

  for (let x = 0; x < width; x++) {
    pushSeed(x);
    pushSeed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    pushSeed(y * width);
    pushSeed(y * width + width - 1);
  }

  const avgEdge = averageRgba(edgeSamples);
  let cursor = 0;
  while (cursor < queue.length) {
    const index = queue[cursor++];
    const x = index % width;
    const y = Math.floor(index / width);
    const neighbors = [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y < height - 1 ? index + width : -1,
    ];

    for (const nextIndex of neighbors) {
      if (nextIndex < 0 || visited[nextIndex] || inkMask[nextIndex]) continue;
      const next = pixels[nextIndex];
      if (next.a < 128) {
        visited[nextIndex] = 1;
        background[nextIndex] = 1;
        queue.push(nextIndex);
        continue;
      }

      const lum = getLuminance(next.r, next.g, next.b);
      const sat = getSaturation(next);
      const closeToEdge = nearestRgbDistanceSq(next, edgeSamples) <= edgeToleranceSq;
      const closeToWhiteBg = lum > 0.88 && sat < 0.16 && rgbDistanceSq(next, avgEdge) <= nearWhiteToleranceSq * 3;
      if (closeToEdge || closeToWhiteBg) {
        visited[nextIndex] = 1;
        background[nextIndex] = 1;
        queue.push(nextIndex);
      }
    }
  }

  return background;
}

function averageRgba(samples) {
  if (!samples.length) return { r: 255, g: 255, b: 255, a: 255 };
  const total = samples.reduce((acc, sample) => {
    acc.r += sample.r;
    acc.g += sample.g;
    acc.b += sample.b;
    acc.a += sample.a ?? 255;
    return acc;
  }, { r: 0, g: 0, b: 0, a: 0 });
  return {
    r: total.r / samples.length,
    g: total.g / samples.length,
    b: total.b / samples.length,
    a: total.a / samples.length,
  };
}

function getSaturation(pixel) {
  const max = Math.max(pixel.r, pixel.g, pixel.b);
  const min = Math.min(pixel.r, pixel.g, pixel.b);
  return max <= 0 ? 0 : (max - min) / max;
}

function isInkPixel(pixel) {
  if (!pixel || pixel.a < 128) return false;
  const lum = getLuminance(pixel.r, pixel.g, pixel.b);
  const sat = getSaturation(pixel);
  return lum < 0.34 || (lum < 0.58 && sat < 0.36);
}

function detectEdgeConnectedBackground(pixels, width, height, toleranceLevel) {
  const total = width * height;
  const background = new Uint8Array(total);
  const visited = new Uint8Array(total);
  const queue = [];
  const edgeSamples = [];
  const level = Math.max(0, Math.min(100, Number(toleranceLevel) || 0));
  const localToleranceSq = Math.pow(18 + level * 1.15, 2);
  const edgeToleranceSq = Math.pow(34 + level * 1.85, 2);
  const pushSeed = (index) => {
    if (visited[index] || pixels[index].a < 128) return;
    visited[index] = 1;
    background[index] = 1;
    queue.push(index);
    edgeSamples.push(pixels[index]);
  };

  for (let x = 0; x < width; x++) {
    pushSeed(x);
    pushSeed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    pushSeed(y * width);
    pushSeed(y * width + width - 1);
  }

  let cursor = 0;
  while (cursor < queue.length) {
    const index = queue[cursor++];
    const x = index % width;
    const y = Math.floor(index / width);
    const current = pixels[index];
    const neighbors = [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y < height - 1 ? index + width : -1,
    ];

    for (const nextIndex of neighbors) {
      if (nextIndex < 0 || visited[nextIndex]) continue;
      const next = pixels[nextIndex];
      if (next.a < 128) {
        visited[nextIndex] = 1;
        background[nextIndex] = 1;
        continue;
      }
      if (
        rgbDistanceSq(current, next) <= localToleranceSq &&
        nearestRgbDistanceSq(next, edgeSamples) <= edgeToleranceSq
      ) {
        visited[nextIndex] = 1;
        background[nextIndex] = 1;
        queue.push(nextIndex);
      }
    }
  }

  return background;
}

function rgbDistanceSq(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function nearestRgbDistanceSq(pixel, samples) {
  let nearest = Infinity;
  for (let i = 0; i < samples.length; i += 1) {
    const dist = rgbDistanceSq(pixel, samples[i]);
    if (dist < nearest) nearest = dist;
    if (nearest === 0) break;
  }
  return nearest;
}

function clamp255(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function updateEdgeEnhanceLabel() {
  if (!els.edgeEnhanceValue || !els.edgeEnhanceLevel) return;
  els.edgeEnhanceValue.textContent = String(els.edgeEnhanceLevel.value);
}

function updateBgToleranceLabel() {
  if (!els.bgToleranceValue || !els.bgToleranceLevel) return;
  els.bgToleranceValue.textContent = String(els.bgToleranceLevel.value);
}

function syncBgToleranceRow() {
  if (!els.bgToleranceRow) return;
  els.bgToleranceRow.hidden = getAlphaMode() !== "subject";
}

function getBgTolerance() {
  return Number(els.bgToleranceLevel?.value ?? 35);
}

function getEdgeEnhanceStrength(level) {
  const amount = Number(level);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.pow(amount / 100, 1.15);
}

function blurGrid3x3(pixels, width, height) {
  const blurred = new Array(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixel = pixels[idx];
      if (!pixel) {
        blurred[idx] = null;
        continue;
      }

      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const neighbor = pixels[ny * width + nx];
          if (!neighbor) continue;
          r += neighbor.r;
          g += neighbor.g;
          b += neighbor.b;
          count += 1;
        }
      }

      if (count === 0) {
        blurred[idx] = pixel;
      } else {
        blurred[idx] = {
          r: r / count,
          g: g / count,
          b: b / count,
        };
      }
    }
  }

  return blurred;
}

function computeEdgeMagnitudes(pixels, width, height) {
  const magnitudes = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const center = pixels[idx];
      if (!center) continue;

      const fallbackLum = getLuminance(center.r, center.g, center.b);
      const luminanceAt = (px, py) => {
        if (px < 0 || px >= width || py < 0 || py >= height) return fallbackLum;
        const sample = pixels[py * width + px];
        if (!sample) return fallbackLum;
        return getLuminance(sample.r, sample.g, sample.b);
      };

      const gx =
        -luminanceAt(x - 1, y - 1) + luminanceAt(x + 1, y - 1)
        - 2 * luminanceAt(x - 1, y) + 2 * luminanceAt(x + 1, y)
        - luminanceAt(x - 1, y + 1) + luminanceAt(x + 1, y + 1);

      const gy =
        -luminanceAt(x - 1, y - 1) - 2 * luminanceAt(x, y - 1) - luminanceAt(x + 1, y - 1)
        + luminanceAt(x - 1, y + 1) + 2 * luminanceAt(x, y + 1) + luminanceAt(x + 1, y + 1);

      magnitudes[idx] = Math.hypot(gx, gy);
    }
  }

  return magnitudes;
}

function enhanceGridEdges(pixels, width, height, level) {
  const strength = getEdgeEnhanceStrength(level);
  if (strength <= 0) return pixels;

  const unsharpAmount = strength * 1.8;
  const blurred = blurGrid3x3(pixels, width, height);
  const enhanced = pixels.map((pixel, index) => {
    if (!pixel) return null;
    const blurPixel = blurred[index];
    if (!blurPixel) return pixel;

    return {
      r: clamp255(pixel.r + unsharpAmount * (pixel.r - blurPixel.r)),
      g: clamp255(pixel.g + unsharpAmount * (pixel.g - blurPixel.g)),
      b: clamp255(pixel.b + unsharpAmount * (pixel.b - blurPixel.b)),
    };
  });

  const magnitudes = computeEdgeMagnitudes(enhanced, width, height);
  let maxMagnitude = 0;
  for (const value of magnitudes) {
    if (value > maxMagnitude) maxMagnitude = value;
  }
  if (maxMagnitude <= 0) return enhanced;

  const edgeDarken = strength * 0.42;
  const edgeContrast = strength * 0.28;

  return enhanced.map((pixel, index) => {
    if (!pixel) return null;

    const edgeRatio = magnitudes[index] / maxMagnitude;
    if (edgeRatio < 0.12) return pixel;

    const edgeWeight = Math.min(1, (edgeRatio - 0.12) / 0.55);
    const lum = getLuminance(pixel.r, pixel.g, pixel.b);
    const sign = lum > 0.5 ? -1 : 1;
    const contrastBoost = 1 + sign * edgeContrast * edgeWeight;
    const darken = 1 - edgeDarken * edgeWeight;

    return {
      r: clamp255(pixel.r * contrastBoost * darken),
      g: clamp255(pixel.g * contrastBoost * darken),
      b: clamp255(pixel.b * contrastBoost * darken),
    };
  });
}

function updateColorMergeLabel() {
  if (!els.colorMergeValue || !els.colorMergeLevel) return;
  els.colorMergeValue.textContent = String(els.colorMergeLevel.value);
}

function getMergeThresholdFromLevel(level) {
  const amount = Number(level);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(Math.pow(amount / 100, 1.6) * 220);
}

function getMergeSmoothPasses(level) {
  const amount = Number(level);
  if (amount < 15) return 0;
  if (amount < 40) return 2;
  if (amount < 70) return 3;
  return 4;
}

function populateOutlineColorSelect() {
  if (!els.outlineColorSelect || state.palette.length === 0) return;

  const sorted = state.palette
    .slice()
    .sort((a, b) => a.luminance - b.luminance || a.code.localeCompare(b.code));

  const preferred = sorted.find((color) => color.code === "H7") || sorted[0];
  els.outlineColorSelect.innerHTML = sorted.map((color) => {
    const label = `${color.code} · ${color.hex}`;
    return `<option value="${color.code}">${label}</option>`;
  }).join("");
  els.outlineColorSelect.value = preferred.code;
}

function syncOutlineColorRow() {
  if (!els.outlineColorRow) return;
  els.outlineColorRow.hidden = !els.outlineEnabled?.checked;
}

function getSelectedOutlineColor() {
  const code = els.outlineColorSelect?.value;
  return state.palette.find((color) => color.code === code)
    || state.palette.find((color) => color.code === "H7")
    || findNearestPaletteColor({ r: 0, g: 0, b: 0 });
}

function buildBackgroundMask(cells, width, height) {
  const total = width * height;
  const isBg = new Uint8Array(total);
  const queue = [];

  for (let i = 0; i < total; i++) {
    if (!cells[i]) {
      isBg[i] = 1;
    }
  }

  const edgeCounts = new Map();
  const markEdge = (idx) => {
    const cell = cells[idx];
    const key = cell?.code || "__transparent__";
    edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
  };

  for (let x = 0; x < width; x++) {
    markEdge(x);
    markEdge((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    markEdge(y * width);
    markEdge(y * width + width - 1);
  }

  let bgCode = null;
  let bgCount = -1;
  for (const [code, count] of edgeCounts) {
    if (count > bgCount) {
      bgCount = count;
      bgCode = code === "__transparent__" ? null : code;
    }
  }

  const matchesBackground = (idx) => {
    if (!cells[idx]) return true;
    if (bgCode === null) return false;
    return cells[idx].code === bgCode;
  };

  for (let x = 0; x < width; x++) {
    const top = x;
    const bottom = (height - 1) * width + x;
    if (matchesBackground(top) && !isBg[top]) { isBg[top] = 1; queue.push(top); }
    if (matchesBackground(bottom) && !isBg[bottom]) { isBg[bottom] = 1; queue.push(bottom); }
  }
  for (let y = 0; y < height; y++) {
    const left = y * width;
    const right = y * width + width - 1;
    if (matchesBackground(left) && !isBg[left]) { isBg[left] = 1; queue.push(left); }
    if (matchesBackground(right) && !isBg[right]) { isBg[right] = 1; queue.push(right); }
  }

  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  while (queue.length > 0) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (isBg[ni]) continue;
      if (!matchesBackground(ni)) continue;
      isBg[ni] = 1;
      queue.push(ni);
    }
  }

  return isBg;
}

function applyOuterOutline(cells, width, height, outlineColor) {
  if (!outlineColor) return;

  const isBg = buildBackgroundMask(cells, width, height);
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const outlineIndices = [];

  for (let i = 0; i < cells.length; i++) {
    if (!isBg[i]) continue;

    const x = i % width;
    const y = (i - x) / width;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (!isBg[ni]) {
        outlineIndices.push(i);
        break;
      }
    }
  }

  for (const idx of outlineIndices) {
    cells[idx] = outlineColor;
  }
}

function mapGridToPalette(grid, width, height, colorLimit, dither, colorMergeLevel = 0, outlineOptions = null) {
  const mergeThreshold = getMergeThresholdFromLevel(colorMergeLevel);
  const finiteLimit = colorLimit > 0 ? colorLimit : Infinity;
  const sourceColors = grid.filter(Boolean);
  let quantizedPalette = Number.isFinite(finiteLimit) && sourceColors.length > finiteLimit
    ? medianCut(sourceColors, finiteLimit)
    : [];

  if (quantizedPalette.length > 0) {
    quantizedPalette = kmeansRefine(sourceColors, quantizedPalette, 6);
    if (mergeThreshold > 0) {
      quantizedPalette = consolidateSimilarColors(quantizedPalette, mergeThreshold);
    }
  }

  let cells = dither
    ? ditherMapGrid(grid, width, height, quantizedPalette)
    : grid.map((pixel) => {
        if (!pixel) return null;
        const targetColor = quantizedPalette.length > 0
          ? findNearestRgb(pixel, quantizedPalette)
          : pixel;
        return findNearestPaletteColor(targetColor);
      });

  if (mergeThreshold > 0) {
    mergeSimilarUsedColors(cells, mergeThreshold);
    const passes = getMergeSmoothPasses(colorMergeLevel);
    if (passes > 0) {
      smoothSimilarColorSpeckle(cells, width, height, mergeThreshold, passes);
    }
  }

  if (!dither) {
    eliminateRareColors(cells, width, height, Math.max(3, Math.floor(cells.filter(Boolean).length * 0.005)));
    removeIsolatedPixels(cells, width, height, 2);
    mergeSmallRegions(cells, width, height, 4);
    removeIsolatedPixels(cells, width, height, 1);
    if (mergeThreshold > 0) {
      smoothSimilarColorSpeckle(cells, width, height, mergeThreshold, 1);
    }
  }

  if (outlineOptions?.enabled && outlineOptions.color) {
    applyOuterOutline(cells, width, height, outlineOptions.color);
  }

  return buildPatternFromCells(width, height, cells);
}

function mapIllustrationGridToPalette(sampled, colorLimit, dither, colorMergeLevel = 0, outlineOptions = null) {
  const { grid, inkMask, width, height } = sampled;
  const mergeThreshold = getMergeThresholdFromLevel(colorMergeLevel);
  const finiteLimit = colorLimit > 0 ? colorLimit : Infinity;
  const inkPixels = [];
  const fillPixels = [];

  for (let i = 0; i < grid.length; i++) {
    const pixel = grid[i];
    if (!pixel) continue;
    if (inkMask[i]) {
      inkPixels.push(pixel);
    } else {
      fillPixels.push(pixel);
    }
  }

  const reservedInkColors = inkPixels.length > 0 ? 2 : 0;
  const fillLimit = Number.isFinite(finiteLimit)
    ? Math.max(4, finiteLimit - reservedInkColors)
    : Infinity;
  let quantizedPalette = Number.isFinite(fillLimit) && fillPixels.length > fillLimit
    ? medianCut(fillPixels, fillLimit)
    : [];

  if (quantizedPalette.length > 0) {
    quantizedPalette = kmeansRefine(fillPixels, quantizedPalette, 5);
    if (mergeThreshold > 0) {
      quantizedPalette = consolidateSimilarColors(quantizedPalette, mergeThreshold);
    }
  }

  let cells = dither
    ? ditherMapGrid(grid.map((pixel, index) => (inkMask[index] ? null : pixel)), width, height, quantizedPalette)
    : grid.map((pixel, index) => {
        if (!pixel) return null;
        if (inkMask[index]) return mapInkPixel(pixel);
        const targetColor = quantizedPalette.length > 0
          ? findNearestRgb(pixel, quantizedPalette)
          : pixel;
        return findNearestPaletteColor(targetColor);
      });

  for (let i = 0; i < cells.length; i++) {
    if (grid[i] && inkMask[i]) {
      cells[i] = mapInkPixel(grid[i]);
    }
  }

  if (mergeThreshold > 0) {
    mergeSimilarUsedColors(cells, Math.min(mergeThreshold, 90));
    smoothSimilarColorSpeckle(cells, width, height, Math.min(mergeThreshold, 90), 1);
  }

  mergeSmallRegionsProtected(cells, width, height, 3, inkMask);
  removeIsolatedPixelsProtected(cells, width, height, 1, inkMask);
  restoreInkCells(cells, grid, inkMask);

  if (outlineOptions?.enabled && outlineOptions.color) {
    applyOuterOutline(cells, width, height, outlineOptions.color);
    restoreInkCells(cells, grid, inkMask);
  }

  return buildPatternFromCells(width, height, cells);
}

function mapInkPixel(pixel) {
  const lum = getLuminance(pixel.r, pixel.g, pixel.b);
  const target = lum < 0.24
    ? { r: 18, g: 18, b: 18 }
    : { r: 90, g: 90, b: 90 };
  return findNearestPaletteColor(target);
}

function restoreInkCells(cells, grid, inkMask) {
  for (let i = 0; i < cells.length; i++) {
    if (grid[i] && inkMask[i]) {
      cells[i] = mapInkPixel(grid[i]);
    }
  }
}

function buildPatternFromCells(width, height, cells, generatedAt = new Date()) {
  const statsMap = new Map();
  for (const cell of cells) {
    if (!cell) {
      continue;
    }

    const item = statsMap.get(cell.code) || {
      code: cell.code,
      hex: cell.hex,
      r: cell.r,
      g: cell.g,
      b: cell.b,
      count: 0,
    };
    item.count += 1;
    statsMap.set(cell.code, item);
  }

  const stats = Array.from(statsMap.values()).sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
  const beadCount = stats.reduce((sum, item) => sum + item.count, 0);

  return {
    width,
    height,
    cells,
    stats,
    beadCount,
    colorCount: stats.length,
    generatedAt,
  };
}

function refreshPatternAfterEdit() {
  if (!state.pattern) {
    return;
  }

  state.pattern = buildPatternFromCells(
    state.pattern.width,
    state.pattern.height,
    state.pattern.cells,
    state.pattern.generatedAt,
  );
  renderPreview(state.pattern);
  renderStats(state.pattern);
  renderEditorPalette();
  updateClearColorButton();
  els.downloadBtn.disabled = false;
}

function resetEditorForPattern(pattern) {
  const firstColor = pattern.stats[0]
    ? state.palette.find((color) => color.code === pattern.stats[0].code)
    : state.palette[0];

  state.editor.enabled = false;
  state.editor.activeTool = "paint";
  state.editor.selectedColor = firstColor || null;
  state.editor.zoom = 1;
  state.editor.showCodes = true;
  state.editor.showGrid = true;
  state.editor.showSourceUnderlay = false;
  state.editor.showPixels = true;
  state.editor.colorMode = "used";
  state.editor.history = [];
  state.editor.future = [];
  state.editor.selection = null;
  state.editor.dragStart = null;
  state.editor.hoverCell = null;
  state.editor.mergeFromCode = null;
  state.editor.mergeToCode = firstColor?.code || null;
  state.editor.mergePickTarget = null;
  state.editor.strokeActive = false;
  state.editor.lastPaintedIndex = -1;
  state.editor.spacePanning = false;
  state.editor.paletteHidden = false;
  endCanvasPan();

  state.editor.paletteHidden = false;
  syncPaletteVisibility();

  els.editToggleBtn.disabled = false;
  els.editToggleBtn.textContent = "进入编辑 →";
  els.zoomSelect.value = "fit";
  state.editor.zoom = 1;
  els.showCodes.checked = true;
  els.showGrid.checked = true;
  if (els.showSourceUnderlay) {
    els.showSourceUnderlay.checked = false;
  }
  if (els.showPixels) {
    els.showPixels.checked = true;
  }
  updateSourceUnderlayControl();
  els.colorMode.value = "used";
  els.colorSearch.value = "";
  setEditorTool("paint");
  updateEditorButtons();
  updateSelectionButtons();
  els.hoverInfo.textContent = "悬停格子查看坐标";
  initMergeColorState();
}

function computeFitEditorZoom() {
  const body = els.editorCanvasBody;
  if (!body || !state.pattern) return 1;

  const baseCellSize = getPreviewCellSize(state.pattern.width);
  const gridW = state.pattern.width * baseCellSize;
  const gridH = state.pattern.height * baseCellSize;
  const pad = 48;
  const availW = Math.max(80, body.clientWidth - pad);
  const availH = Math.max(80, body.clientHeight - pad);

  if (gridW <= 0 || gridH <= 0) return 1;

  const fit = Math.min(availW / gridW, availH / gridH) * 0.94;
  return Math.max(0.25, Math.min(4, fit));
}

function applyEditorZoom() {
  if (!state.pattern) return;

  if (els.zoomSelect.value === "fit") {
    setEditorZoomValue(computeFitEditorZoom());
  } else {
    setEditorZoomValue(Number(els.zoomSelect.value));
  }
}

function enterEditorView(options = {}) {
  if (!state.pattern) return;
  state.editor.enabled = true;
  els.editToggleBtn.textContent = "正在编辑";
  els.editToggleBtn.disabled = true;
  els.editorCanvasWrap?.classList.add("editing");
  els.zoomSelect.value = "fit";
  setView("editor");
  syncResizeInputs();
  updateSourcePreviewFloat();
  updateEditorBackButton();
  if (!options.restoring) {
    markCurrentHistoryEdited();
    void persistHistoryEntry();
  }
  requestAnimationFrame(() => {
    state.editor.zoom = computeFitEditorZoom();
    renderPreview(state.pattern);
    renderEditorPalette();
  });
}

function exitEditorView() {
  endPaintStroke();
  endCanvasPan();
  closeEditorPopovers();
  closeSourcePreviewModal();
  void persistHistoryEntry();
  state.editor.enabled = false;
  state.editor.selection = null;
  state.editor.dragStart = null;
  state.editor.spacePanning = false;
  els.editToggleBtn.textContent = "进入编辑 →";
  els.editToggleBtn.disabled = !state.pattern;
  els.editorCanvasWrap?.classList.remove("editing");
  updateEditorPanCursor();
  updateSelectionButtons();
  renderPreview(state.pattern);
}

function setEditorTool(tool) {
  state.editor.activeTool = tool;
  els.editorTools.forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
}

function updateSourcePreviewFloat() {
  if (!els.sourcePreviewFloat || !els.editorSourcePreview) return;
  const show = Boolean(state.sourceUrl && state.pattern);
  els.sourcePreviewFloat.hidden = !show;
  if (show) {
    els.editorSourcePreview.src = state.sourceUrl;
  }
  updateSourceUnderlayControl();
}

function updateSourceUnderlayControl() {
  if (!els.showSourceUnderlay) return;
  const available = Boolean(state.image && state.pattern);
  els.showSourceUnderlay.disabled = !available;
  if (!available) {
    els.showSourceUnderlay.checked = false;
    state.editor.showSourceUnderlay = false;
  }
}

function updateSourcePreviewModalZoom() {
  const zoom = state.editor.sourcePreviewZoom;
  if (els.editorSourcePreviewLarge) {
    els.editorSourcePreviewLarge.style.transform = `scale(${zoom})`;
  }
  if (els.sourceZoomLabel) {
    els.sourceZoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }
}

function openSourcePreviewModal() {
  if (!state.sourceUrl) return;
  state.editor.sourcePreviewZoom = 1;
  if (els.editorSourcePreviewLarge) {
    els.editorSourcePreviewLarge.src = state.sourceUrl;
  }
  updateSourcePreviewModalZoom();
  if (els.sourcePreviewModal) {
    els.sourcePreviewModal.hidden = false;
  }
}

function closeSourcePreviewModal() {
  if (els.sourcePreviewModal) {
    els.sourcePreviewModal.hidden = true;
  }
}

function adjustSourcePreviewZoom(factor) {
  state.editor.sourcePreviewZoom = Math.max(0.2, Math.min(6, state.editor.sourcePreviewZoom * factor));
  updateSourcePreviewModalZoom();
}

function handleSourceModalWheel(event) {
  if (els.sourcePreviewModal?.hidden) return;
  event.preventDefault();
  adjustSourcePreviewZoom(event.deltaY < 0 ? 1.15 : 1 / 1.15);
}

function togglePalettePanel() {
  state.editor.paletteHidden = !state.editor.paletteHidden;
  syncPaletteVisibility();
}

function syncPaletteVisibility() {
  if (els.edPaletteFloat) {
    els.edPaletteFloat.hidden = state.editor.paletteHidden;
  }
  if (els.paletteShowTab) {
    els.paletteShowTab.hidden = !state.editor.paletteHidden;
  }
  if (els.togglePaletteBtn) {
    els.togglePaletteBtn.textContent = "隐藏";
  }
}

function closeEditorPopovers() {
  if (els.canvasResizePanel) {
    els.canvasResizePanel.hidden = true;
  }
  if (els.mergePanel) {
    els.mergePanel.hidden = true;
  }
}

function toggleEditorPopover(panel) {
  if (!panel) return;
  const willOpen = panel.hidden;
  closeEditorPopovers();
  panel.hidden = !willOpen;
}

function closeEditorPopoversOnOutsideClick(event) {
  if (!isEditorInteractionActive()) return;
  if (event.target.closest(".ed-popover-wrap")) return;
  closeEditorPopovers();
}

function syncResizeInputs() {
  if (!state.pattern || !els.resizeWidthInput) return;
  els.resizeWidthInput.value = String(state.pattern.width);
  els.resizeHeightInput.value = String(state.pattern.height);
}

function getResizeOffset(oldW, oldH, newW, newH, anchor) {
  switch (anchor) {
    case "top-right":
      return { x: newW - oldW, y: 0 };
    case "bottom-left":
      return { x: 0, y: newH - oldH };
    case "bottom-right":
      return { x: newW - oldW, y: newH - oldH };
    case "top-left":
      return { x: 0, y: 0 };
    default:
      return { x: Math.floor((newW - oldW) / 2), y: Math.floor((newH - oldH) / 2) };
  }
}

function applyCanvasResize() {
  if (!state.pattern) return;

  const newW = Number.parseInt(els.resizeWidthInput.value, 10);
  const newH = Number.parseInt(els.resizeHeightInput.value, 10);
  if (
    !Number.isFinite(newW) || !Number.isFinite(newH)
    || newW < WIDTH_MIN || newW > WIDTH_MAX
    || newH < WIDTH_MIN || newH > WIDTH_MAX
  ) {
    setStatus(`画布尺寸需在 ${WIDTH_MIN}–${WIDTH_MAX} 格之间。`, "error");
    return;
  }

  const oldW = state.pattern.width;
  const oldH = state.pattern.height;
  if (newW === oldW && newH === oldH) {
    closeEditorPopovers();
    return;
  }

  const { x: offX, y: offY } = getResizeOffset(
    oldW,
    oldH,
    newW,
    newH,
    els.resizeAnchorSelect?.value || "center",
  );
  const newCells = new Array(newW * newH).fill(null);

  for (let y = 0; y < oldH; y += 1) {
    for (let x = 0; x < oldW; x += 1) {
      const nx = x + offX;
      const ny = y + offY;
      if (nx >= 0 && nx < newW && ny >= 0 && ny < newH) {
        newCells[ny * newW + nx] = state.pattern.cells[y * oldW + x];
      }
    }
  }

  pushHistory();
  state.pattern = buildPatternFromCells(newW, newH, newCells, state.pattern.generatedAt);
  state.editor.selection = null;
  refreshPatternAfterEdit();
  closeEditorPopovers();
  syncResizeInputs();
  requestAnimationFrame(() => {
    state.editor.zoom = computeFitEditorZoom();
    syncZoomSelectFromValue();
    renderPreview(state.pattern);
  });
  setStatus(`画布已调整为 ${newW} × ${newH} 格。`, "success");
}

function startCustomDrawing() {
  if (state.palette.length === 0) {
    setStatus("色板尚未加载完成，请稍候。", "error");
    return;
  }

  const width = getRequestedWidth();
  const height = width;
  if (!Number.isFinite(width) || width < WIDTH_MIN || width > WIDTH_MAX) {
    setStatus(`宽度格数需在 ${WIDTH_MIN} 到 ${WIDTH_MAX} 之间。`, "error");
    updateEstimate();
    return;
  }

  state.image = null;
  state.imageFile = null;
  if (state.sourceUrl) {
    URL.revokeObjectURL(state.sourceUrl);
    state.sourceUrl = "";
  }

  const cells = new Array(width * height).fill(null);
  state.pattern = buildPatternFromCells(width, height, cells);
  resetEditorForPattern(state.pattern);
  els.downloadBtn.disabled = false;
  els.editToggleBtn.disabled = false;
  renderStats(state.pattern);
  updateSourcePreviewFloat();

  clearHistorySession();
  void saveHistoryAfterCustomDraw(width, height);
  setView("workspace");
  setStatus(`已创建 ${width} × ${height} 空白画布，进入编辑器开始绘制。`, "success");
  state.reopenMode = null;
  updateEditorBackButton();
  enterEditorView();
}

function renderEditorPalette() {
  if (!els.colorPalette || !state.pattern) return;

  const query = els.colorSearch.value.trim().toLowerCase();
  const colors = state.editor.colorMode === "all"
    ? state.palette
    : state.pattern.stats
        .map((item) => state.palette.find((color) => color.code === item.code))
        .filter(Boolean);

  const filtered = colors.filter((color) => {
    if (!query) return true;
    return color.code.toLowerCase().includes(query) || color.hex.toLowerCase().includes(query);
  });

  els.colorPalette.innerHTML = filtered.map((color) => {
    const count = state.pattern.stats.find((item) => item.code === color.code)?.count || 0;
    const active = state.editor.selectedColor?.code === color.code ? " active" : "";
    return `
      <button type="button" class="color-chip${active}" data-color="${color.code}" title="${color.code} ${color.hex}">
        <span class="color-chip-swatch" style="background:${color.hex}"></span>
        <span class="color-chip-meta">
          <strong>${color.code}</strong>
          <small>${count ? `${count} 颗` : color.hex}</small>
        </span>
      </button>
    `;
  }).join("") || '<p class="empty">没有匹配的颜色</p>';

  els.colorPalette.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      const color = state.palette.find((item) => item.code === button.dataset.color);
      if (!color) return;

      if (state.editor.mergePickTarget === "from") {
        assignMergeColor("from", color.code);
        return;
      }
      if (state.editor.mergePickTarget === "to") {
        assignMergeColor("to", color.code);
        return;
      }

      state.editor.selectedColor = color;
      state.editor.mergeToCode = color.code;
      if (state.editor.activeTool === "eraser" || state.editor.activeTool === "picker") {
        setEditorTool("paint");
      }
      renderEditorPalette();
      updateMergeControls();
    });
  });

  renderMergePickDisplays();
  updateClearColorButton();
}

function initMergeColorState() {
  const hasColors = Boolean(state.pattern?.stats.length);
  const defaultTo = state.editor.selectedColor?.code || state.pattern?.stats[0]?.code || null;

  if (defaultTo && state.pattern?.stats.some((item) => item.code === defaultTo)) {
    state.editor.mergeToCode = defaultTo;
  }

  if (state.editor.mergeFromCode && !state.pattern?.stats.some((item) => item.code === state.editor.mergeFromCode)) {
    state.editor.mergeFromCode = null;
  }

  if (state.editor.mergeToCode && !state.palette.some((color) => color.code === state.editor.mergeToCode)) {
    state.editor.mergeToCode = defaultTo;
  }

  setMergePickTarget(null);
  if (els.mergeFromPick) els.mergeFromPick.disabled = !hasColors;
  if (els.mergeToPick) els.mergeToPick.disabled = !hasColors;
  renderMergePickDisplays();
  updateMergeControls();
}

function renderMergePickDisplay(code) {
  if (!code) {
    return '<span class="merge-pick-placeholder">点击选择</span>';
  }

  const color = state.palette.find((item) => item.code === code);
  if (!color) {
    return `<span class="merge-pick-placeholder">${code}</span>`;
  }

  const count = state.pattern?.stats.find((item) => item.code === code)?.count;
  const countText = count ? `${count.toLocaleString("zh-CN")} 颗` : "";

  return `
    <span class="merge-pick-color">
      <span class="color-chip-swatch" style="background:${color.hex}"></span>
      <strong>${color.code}</strong>
      ${countText ? `<small>${countText}</small>` : ""}
    </span>
  `;
}

function renderMergePickDisplays() {
  if (els.mergeFromDisplay) {
    els.mergeFromDisplay.innerHTML = renderMergePickDisplay(state.editor.mergeFromCode);
  }
  if (els.mergeToDisplay) {
    els.mergeToDisplay.innerHTML = renderMergePickDisplay(state.editor.mergeToCode);
  }
}

function setMergePickTarget(target) {
  const next = state.editor.mergePickTarget === target ? null : target;
  state.editor.mergePickTarget = next;

  els.mergeFromPick?.classList.toggle("picking", next === "from");
  els.mergeToPick?.classList.toggle("picking", next === "to");
  els.editorCanvasWrap?.classList.toggle("merge-picking", Boolean(next));

  if (els.mergeHint) {
    if (next === "from") {
      els.mergeHint.textContent = "点击色板或图纸格子，选择被合并色号";
    } else if (next === "to") {
      els.mergeHint.textContent = "点击色板或图纸格子，选择合并目标色号";
    } else {
      updateMergeControls();
    }
  }
}

function assignMergeColor(role, code) {
  if (!code || !state.pattern) return false;

  const color = state.palette.find((item) => item.code === code);
  if (!color) return false;

  if (role === "from") {
    if (!state.pattern.stats.some((item) => item.code === code)) {
      setStatus("该颜色在当前图纸中未使用，不能作为被合并色号。", "error");
      return false;
    }
    state.editor.mergeFromCode = code;
  } else {
    state.editor.mergeToCode = code;
    state.editor.selectedColor = color;
  }

  setMergePickTarget(null);
  renderMergePickDisplays();
  renderEditorPalette();
  updateMergeControls();
  return true;
}

function updateMergeControls() {
  if (!els.mergeColorsBtn || !els.mergeHint) return;

  if (state.editor.mergePickTarget) {
    els.mergeColorsBtn.disabled = true;
    return;
  }

  if (!state.pattern || state.pattern.stats.length === 0) {
    els.mergeColorsBtn.disabled = true;
    els.mergeHint.textContent = "生成图纸后可合并颜色";
    return;
  }

  const fromCode = state.editor.mergeFromCode;
  const toCode = state.editor.mergeToCode;
  const fromCount = state.pattern.stats.find((item) => item.code === fromCode)?.count || 0;

  if (!fromCode || !toCode) {
    els.mergeColorsBtn.disabled = true;
    els.mergeHint.textContent = "请先点按钮，再点击色板或图纸选择两种色号";
    return;
  }

  if (fromCode === toCode) {
    els.mergeColorsBtn.disabled = true;
    els.mergeHint.textContent = "被合并色号与目标色号不能相同";
    return;
  }

  els.mergeColorsBtn.disabled = false;
  els.mergeHint.textContent = `将把 ${fromCode} 的 ${fromCount.toLocaleString("zh-CN")} 颗豆全部改为 ${toCode}`;
}

function mergeColorsBySelection() {
  if (!state.pattern) return;

  const fromCode = state.editor.mergeFromCode;
  const toCode = state.editor.mergeToCode;
  if (!fromCode || !toCode || fromCode === toCode) return;

  const toColor = state.palette.find((color) => color.code === toCode);
  if (!toColor) return;

  let changed = 0;
  for (let i = 0; i < state.pattern.cells.length; i++) {
    if (state.pattern.cells[i]?.code === fromCode) {
      changed += 1;
    }
  }

  if (changed === 0) {
    setStatus(`图纸中没有 ${fromCode}，无需合并。`, "error");
    updateMergeControls();
    return;
  }

  pushHistory();
  for (let i = 0; i < state.pattern.cells.length; i++) {
    if (state.pattern.cells[i]?.code === fromCode) {
      state.pattern.cells[i] = toColor;
    }
  }

  state.editor.mergeFromCode = null;
  refreshPatternAfterEdit();
  renderMergePickDisplays();
  updateMergeControls();
  setStatus(`已将 ${fromCode} 的 ${changed.toLocaleString("zh-CN")} 颗豆合并为 ${toCode}。`, "success");
}

function getCanvasCell(event) {
  if (!state.pattern) return null;

  const canvas = els.editorCanvas;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const canvasX = (event.clientX - rect.left) * scaleX;
  const canvasY = (event.clientY - rect.top) * scaleY;
  const cellSize = getActivePreviewCellSize();
  const col = Math.floor(canvasX / cellSize);
  const row = Math.floor(canvasY / cellSize);

  if (row < 0 || row >= state.pattern.height || col < 0 || col >= state.pattern.width) {
    return null;
  }

  return { row, col, index: row * state.pattern.width + col };
}

function isPaintToolActive() {
  return state.editor.activeTool === "paint" || state.editor.activeTool === "eraser";
}

function startPaintStroke() {
  if (!state.editor.strokeActive) {
    pushHistory();
    state.editor.strokeActive = true;
    state.editor.lastPaintedIndex = -1;
  }
}

function endPaintStroke() {
  if (!state.editor.strokeActive) return;

  state.editor.strokeActive = false;
  state.editor.lastPaintedIndex = -1;
  refreshPatternAfterEdit();
}

function paintCellDuringStroke(cell) {
  if (!state.pattern || !cell) return;

  if (cell.index === state.editor.lastPaintedIndex) return;

  const current = state.pattern.cells[cell.index];
  const nextCell = state.editor.activeTool === "eraser" ? null : state.editor.selectedColor;
  if (sameCellColor(current, nextCell)) return;

  state.editor.lastPaintedIndex = cell.index;
  state.pattern.cells[cell.index] = nextCell;
  renderPreview(state.pattern);
}

function handleCanvasPointerDown(event) {
  if (!state.editor.enabled || !state.pattern) return;

  if (shouldStartCanvasPan(event)) {
    startCanvasPan(event);
    return;
  }

  const cell = getCanvasCell(event);
  if (!cell) return;
  event.preventDefault();

  if (state.editor.mergePickTarget) {
    const cellColor = state.pattern.cells[cell.index];
    if (!cellColor) {
      setStatus("透明格不能作为合并颜色，请选择有颜色的格子。", "error");
      return;
    }
    assignMergeColor(state.editor.mergePickTarget, cellColor.code);
    return;
  }

  if (state.editor.activeTool === "select") {
    state.editor.dragStart = cell;
    state.editor.selection = { start: cell, end: cell };
    els.editorCanvas.setPointerCapture(event.pointerId);
    renderPreview(state.pattern);
    updateSelectionButtons();
    return;
  }

  if (isPaintToolActive()) {
    startPaintStroke();
    paintCellDuringStroke(cell);
    els.editorCanvas.setPointerCapture(event.pointerId);
    return;
  }

  applyToolToCell(cell);
}

function handleCanvasPointerMove(event) {
  if (!state.pattern) return;

  if (state.editor.isPanning) {
    updateCanvasPan(event);
    return;
  }

  const cell = getCanvasCell(event);
  state.editor.hoverCell = cell;
  updateHoverInfo(cell);

  if (!state.editor.enabled) return;

  if (state.editor.strokeActive && (event.buttons & 1) && isPaintToolActive()) {
    if (cell) {
      paintCellDuringStroke(cell);
    }
    return;
  }

  if (state.editor.activeTool !== "select" || !state.editor.dragStart || !cell) {
    return;
  }

  state.editor.selection = { start: state.editor.dragStart, end: cell };
  renderPreview(state.pattern);
  updateSelectionButtons();
}

function handleCanvasPointerUp(event) {
  if (state.editor.strokeActive) {
    endPaintStroke();
    if (els.editorCanvas.hasPointerCapture(event.pointerId)) {
      els.editorCanvas.releasePointerCapture(event.pointerId);
    }
  }

  endCanvasPan(event);

  if (state.editor.dragStart && els.editorCanvas.hasPointerCapture(event.pointerId)) {
    els.editorCanvas.releasePointerCapture(event.pointerId);
  }

  state.editor.dragStart = null;
}

function handleCanvasPointerLeave(event) {
  state.editor.hoverCell = null;
  if (!event.buttons) {
    state.editor.dragStart = null;
  }
  if (!state.editor.strokeActive) {
    els.hoverInfo.textContent = "悬停格子查看坐标";
  }
}

function applyToolToCell(cell) {
  const current = state.pattern.cells[cell.index];

  if (state.editor.activeTool === "picker") {
    if (current) {
      state.editor.selectedColor = current;
      state.editor.mergeToCode = current.code;
      setEditorTool("paint");
      renderEditorPalette();
      updateMergeControls();
      updateHoverInfo(cell);
    }
    return;
  }

  if (state.editor.activeTool === "fill") {
    fillRegion(cell.index);
    return;
  }

  const nextCell = state.editor.activeTool === "eraser" ? null : state.editor.selectedColor;
  if (sameCellColor(current, nextCell)) return;

  pushHistory();
  state.pattern.cells[cell.index] = nextCell;
  refreshPatternAfterEdit();
}

function sameCellColor(a, b) {
  return (a?.code || null) === (b?.code || null);
}

function updateHoverInfo(cell) {
  if (!cell || !state.pattern) {
    els.hoverInfo.textContent = "悬停格子查看坐标";
    return;
  }

  const current = state.pattern.cells[cell.index];
  els.hoverInfo.textContent = `第 ${cell.row + 1} 行，第 ${cell.col + 1} 列 · ${current ? current.code : "透明"}`;
}

function fillRegion(startIndex) {
  if (!state.pattern) return;

  const target = state.pattern.cells[startIndex];
  const replacement = state.editor.activeTool === "eraser" ? null : state.editor.selectedColor;
  if (sameCellColor(target, replacement)) return;

  const width = state.pattern.width;
  const height = state.pattern.height;
  const cells = state.pattern.cells;
  const targetCode = target?.code || null;
  const visited = new Uint8Array(cells.length);
  const queue = [startIndex];
  const members = [];
  visited[startIndex] = 1;

  while (queue.length > 0) {
    const idx = queue.pop();
    const cell = cells[idx];
    if ((cell?.code || null) !== targetCode) continue;

    members.push(idx);
    const x = idx % width;
    const y = (idx - x) / width;
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      visited[ni] = 1;
      queue.push(ni);
    }
  }

  if (members.length === 0) return;
  pushHistory();
  for (const idx of members) {
    cells[idx] = replacement;
  }
  refreshPatternAfterEdit();
}

function normalizeSelection(selection) {
  if (!selection?.start || !selection?.end) return null;

  const left = Math.min(selection.start.col, selection.end.col);
  const right = Math.max(selection.start.col, selection.end.col);
  const top = Math.min(selection.start.row, selection.end.row);
  const bottom = Math.max(selection.start.row, selection.end.row);

  return {
    left,
    right,
    top,
    bottom,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

function applySelectionPaint() {
  const rect = normalizeSelection(state.editor.selection);
  if (!rect || !state.pattern || !state.editor.selectedColor) return;

  pushHistory();
  for (let row = rect.top; row <= rect.bottom; row++) {
    for (let col = rect.left; col <= rect.right; col++) {
      state.pattern.cells[row * state.pattern.width + col] = state.editor.selectedColor;
    }
  }
  state.editor.selection = null;
  updateSelectionButtons();
  refreshPatternAfterEdit();
}

function clearSelection() {
  const rect = normalizeSelection(state.editor.selection);
  if (!rect || !state.pattern) return;

  pushHistory();
  for (let row = rect.top; row <= rect.bottom; row++) {
    for (let col = rect.left; col <= rect.right; col++) {
      state.pattern.cells[row * state.pattern.width + col] = null;
    }
  }
  state.editor.selection = null;
  updateSelectionButtons();
  refreshPatternAfterEdit();
}

function clearSelectedColor() {
  if (!state.pattern || !state.editor.selectedColor) return;

  const targetCode = state.editor.selectedColor.code;
  let changed = 0;
  for (const cell of state.pattern.cells) {
    if (cell?.code === targetCode) changed += 1;
  }

  if (changed === 0) {
    setStatus(`当前图纸中没有 ${targetCode} 色号。`, "error");
    updateClearColorButton();
    return;
  }

  const confirmed = window.confirm(`确定清除图纸中所有 ${targetCode} 色号吗？共 ${changed.toLocaleString("zh-CN")} 格。`);
  if (!confirmed) return;

  pushHistory();
  state.pattern.cells = state.pattern.cells.map((cell) => (cell?.code === targetCode ? null : cell));
  state.editor.selection = null;
  updateSelectionButtons();
  refreshPatternAfterEdit();
  setStatus(`已清除 ${targetCode} 色号，共 ${changed.toLocaleString("zh-CN")} 格。`, "success");
}

function updateSelectionButtons() {
  const hasSelection = Boolean(normalizeSelection(state.editor.selection));
  els.applySelectionBtn.disabled = !hasSelection || !state.editor.selectedColor;
  els.clearSelectionBtn.disabled = !hasSelection;
}

function cleanupTinyRegions() {
  if (!state.pattern) return;
  pushHistory();
  mergeSmallRegions(state.pattern.cells, state.pattern.width, state.pattern.height, 4);
  removeIsolatedPixels(state.pattern.cells, state.pattern.width, state.pattern.height, 1);
  refreshPatternAfterEdit();
  setStatus("已清理小色块，图纸更接近可制作的大色块效果。", "success");
}

function snapshotPattern() {
  return {
    width: state.pattern.width,
    height: state.pattern.height,
    codes: state.pattern.cells.map((cell) => cell?.code || null),
    generatedAt: state.pattern.generatedAt,
  };
}

function restorePattern(snapshot) {
  if (!snapshot) return;

  if (Array.isArray(snapshot)) {
    const cells = snapshot.map((code) => {
      if (!code) return null;
      return state.palette.find((color) => color.code === code) || null;
    });
    state.pattern.cells = cells;
    return;
  }

  const cells = snapshot.codes.map((code) => {
    if (!code) return null;
    return state.palette.find((color) => color.code === code) || null;
  });
  state.pattern = buildPatternFromCells(
    snapshot.width,
    snapshot.height,
    cells,
    snapshot.generatedAt || state.pattern?.generatedAt,
  );
}

function snapshotCells() {
  return snapshotPattern();
}

function restoreCells(snapshot) {
  restorePattern(snapshot);
}

function pushHistory() {
  if (!state.pattern) return;
  state.editor.history.push(snapshotCells());
  if (state.editor.history.length > 20) {
    state.editor.history.shift();
  }
  state.editor.future = [];
  updateEditorButtons();
}

function undoEdit() {
  if (!state.pattern || state.editor.history.length === 0) return;

  state.editor.future.push(snapshotCells());
  const previous = state.editor.history.pop();
  restoreCells(previous);
  state.editor.selection = null;
  updateEditorButtons();
  updateSelectionButtons();
  refreshPatternAfterEdit();
}

function redoEdit() {
  if (!state.pattern || state.editor.future.length === 0) return;

  state.editor.history.push(snapshotCells());
  const next = state.editor.future.pop();
  restoreCells(next);
  state.editor.selection = null;
  updateEditorButtons();
  updateSelectionButtons();
  refreshPatternAfterEdit();
}

function updateEditorButtons() {
  els.undoBtn.disabled = state.editor.history.length === 0;
  els.redoBtn.disabled = state.editor.future.length === 0;
  updateClearColorButton();
}

function updateClearColorButton() {
  if (!els.clearColorBtn) return;
  const selectedCode = state.editor.selectedColor?.code;
  const hasSelectedColor = Boolean(selectedCode);
  const colorInPattern = hasSelectedColor && state.pattern?.stats.some((item) => item.code === selectedCode);
  els.clearColorBtn.disabled = !state.pattern || !colorInPattern;
  els.clearColorBtn.title = colorInPattern
    ? `清除所有 ${selectedCode} 色号`
    : "先在色板或图纸中选择要清除的颜色";
}

function medianCut(colors, limit) {
  let boxes = [colors.slice()];

  while (boxes.length < limit) {
    boxes.sort((a, b) => getColorRange(b) - getColorRange(a));
    const box = boxes.shift();

    if (!box || box.length <= 1) {
      if (box) {
        boxes.push(box);
      }
      break;
    }

    const channel = getWidestChannel(box);
    box.sort((a, b) => a[channel] - b[channel]);
    const middle = Math.ceil(box.length / 2);
    boxes.push(box.slice(0, middle), box.slice(middle));
  }

  return boxes.filter(Boolean).map(averageColor);
}

function getColorRange(colors) {
  const ranges = ["r", "g", "b"].map((channel) => getChannelRange(colors, channel));
  return Math.max(...ranges);
}

function getWidestChannel(colors) {
  return ["r", "g", "b"].reduce((widest, channel) => {
    const channelRange = getChannelRange(colors, channel);
    const widestRange = getChannelRange(colors, widest);
    return channelRange > widestRange ? channel : widest;
  }, "r");
}

function getChannelRange(colors, channel) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const color of colors) {
    if (color[channel] < min) {
      min = color[channel];
    }
    if (color[channel] > max) {
      max = color[channel];
    }
  }

  return max - min;
}

function averageColor(colors) {
  const total = colors.reduce((acc, color) => {
    acc.r += color.r;
    acc.g += color.g;
    acc.b += color.b;
    return acc;
  }, { r: 0, g: 0, b: 0 });

  return {
    r: Math.round(total.r / colors.length),
    g: Math.round(total.g / colors.length),
    b: Math.round(total.b / colors.length),
  };
}

function kmeansRefine(pixels, centroids, iterations) {
  let centers = centroids.map((c) => ({ r: c.r, g: c.g, b: c.b }));

  for (let iter = 0; iter < iterations; iter++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

    for (const pixel of pixels) {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const d = colorDistance(pixel, centers[i]);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      sums[best].r += pixel.r;
      sums[best].g += pixel.g;
      sums[best].b += pixel.b;
      sums[best].count += 1;
    }

    for (let i = 0; i < centers.length; i++) {
      if (sums[i].count > 0) {
        centers[i] = {
          r: Math.round(sums[i].r / sums[i].count),
          g: Math.round(sums[i].g / sums[i].count),
          b: Math.round(sums[i].b / sums[i].count),
        };
        delete centers[i]._lab;
      }
    }
  }

  return centers;
}

function ditherMapGrid(grid, width, height, quantizedPalette) {
  const buffer = grid.map((p) => (p ? { r: p.r, g: p.g, b: p.b } : null));
  const cells = new Array(grid.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixel = buffer[idx];
      if (!pixel) { cells[idx] = null; continue; }

      const clamped = {
        r: Math.max(0, Math.min(255, Math.round(pixel.r))),
        g: Math.max(0, Math.min(255, Math.round(pixel.g))),
        b: Math.max(0, Math.min(255, Math.round(pixel.b))),
      };

      const targetColor = quantizedPalette.length > 0
        ? findNearestRgb(clamped, quantizedPalette)
        : clamped;
      const matched = findNearestPaletteColor(targetColor);
      cells[idx] = matched;

      const errR = clamped.r - matched.r;
      const errG = clamped.g - matched.g;
      const errB = clamped.b - matched.b;

      const spread = [
        [x + 1, y,     7 / 16],
        [x - 1, y + 1, 3 / 16],
        [x,     y + 1, 5 / 16],
        [x + 1, y + 1, 1 / 16],
      ];

      for (const [nx, ny, weight] of spread) {
        if (nx < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        const neighbor = buffer[ni];
        if (!neighbor) continue;
        neighbor.r += errR * weight;
        neighbor.g += errG * weight;
        neighbor.b += errB * weight;
      }
    }
  }

  return cells;
}

function findNearestRgb(pixel, candidates) {
  let nearest = candidates[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const distance = colorDistance(pixel, candidate);
    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function findNearestPaletteColor(pixel) {
  let nearest = state.palette[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const color of state.palette) {
    const distance = colorDistance(pixel, color);
    if (distance < nearestDistance) {
      nearest = color;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function consolidateSimilarColors(colors, threshold) {
  const merged = [];

  for (const color of colors) {
    let nearest = null;
    let nearestDist = threshold;

    for (const existing of merged) {
      const dist = colorDistance(color, existing);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = existing;
      }
    }

    if (nearest) {
      const count = (nearest._count || 1) + 1;
      nearest.r = Math.round((nearest.r * (count - 1) + color.r) / count);
      nearest.g = Math.round((nearest.g * (count - 1) + color.g) / count);
      nearest.b = Math.round((nearest.b * (count - 1) + color.b) / count);
      nearest._count = count;
      delete nearest._lab;
    } else {
      merged.push({ r: color.r, g: color.g, b: color.b, _count: 1 });
    }
  }

  return merged.map(({ r, g, b }) => ({ r, g, b }));
}

function mergeSimilarUsedColors(cells, threshold) {
  const counts = new Map();
  for (const cell of cells) {
    if (!cell) continue;
    counts.set(cell.code, (counts.get(cell.code) || 0) + 1);
  }

  const codes = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
  if (codes.length < 2) return;

  const parent = new Map(codes.map((code) => [code, code]));

  function find(code) {
    let root = code;
    while (parent.get(root) !== root) {
      root = parent.get(root);
    }
    let current = code;
    while (parent.get(current) !== root) {
      const next = parent.get(current);
      parent.set(current, root);
      current = next;
    }
    return root;
  }

  function union(a, b) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    const countA = counts.get(rootA) || 0;
    const countB = counts.get(rootB) || 0;
    if (countA >= countB) {
      parent.set(rootB, rootA);
    } else {
      parent.set(rootA, rootB);
    }
  }

  for (let i = 0; i < codes.length; i++) {
    const colorA = state.palette.find((c) => c.code === codes[i]);
    if (!colorA) continue;
    for (let j = i + 1; j < codes.length; j++) {
      const colorB = state.palette.find((c) => c.code === codes[j]);
      if (!colorB) continue;
      if (colorDistance(colorA, colorB) < threshold) {
        union(codes[i], codes[j]);
      }
    }
  }

  const remap = new Map();
  for (const code of codes) {
    const root = find(code);
    remap.set(code, state.palette.find((c) => c.code === root));
  }

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (!cell) continue;
    const replacement = remap.get(cell.code);
    if (replacement && replacement.code !== cell.code) {
      cells[i] = replacement;
    }
  }
}

function smoothSimilarColorSpeckle(cells, width, height, threshold, maxPasses = 5) {
  const paletteByCode = new Map(state.palette.map((color) => [color.code, color]));

  for (let pass = 0; pass < maxPasses; pass++) {
    const next = cells.slice();
    let changed = false;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell) continue;

      const x = i % width;
      const y = (i - x) / width;
      const tallies = new Map();

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const neighbor = cells[ny * width + nx];
          if (!neighbor) continue;
          tallies.set(neighbor.code, (tallies.get(neighbor.code) || 0) + 1);
        }
      }

      let bestCode = null;
      let bestCount = 0;
      for (const [code, count] of tallies) {
        if (count > bestCount) {
          bestCount = count;
          bestCode = code;
        }
      }

      if (!bestCode || bestCode === cell.code) continue;

      const replacement = paletteByCode.get(bestCode);
      if (!replacement || colorDistance(cell, replacement) >= threshold) continue;

      next[i] = replacement;
      changed = true;
    }

    for (let i = 0; i < cells.length; i++) {
      cells[i] = next[i];
    }
    if (!changed) break;
  }
}

function eliminateRareColors(cells, width, height, threshold) {
  const counts = new Map();
  for (const cell of cells) {
    if (!cell) continue;
    counts.set(cell.code, (counts.get(cell.code) || 0) + 1);
  }

  const rareColors = new Set();
  for (const [code, count] of counts) {
    if (count < threshold) rareColors.add(code);
  }

  if (rareColors.size === 0) return;

  const usedPalette = state.palette.filter((c) => counts.has(c.code) && !rareColors.has(c.code));
  if (usedPalette.length === 0) return;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (!cell || !rareColors.has(cell.code)) continue;
    cells[i] = findNearestInList(cell, usedPalette);
  }
}

function findNearestInList(pixel, list) {
  let nearest = list[0];
  let nearestDist = Infinity;
  for (const c of list) {
    const d = colorDistance(pixel, c);
    if (d < nearestDist) { nearestDist = d; nearest = c; }
  }
  return nearest;
}

function removeIsolatedPixels(cells, width, height, maxIslandSize) {
  const total = width * height;

  for (let passes = 0; passes < 3; passes++) {
    let changed = false;
    for (let i = 0; i < total; i++) {
      const cell = cells[i];
      if (!cell) continue;

      const x = i % width;
      const y = (i - x) / width;
      const neighbors = [];
      const neighborCounts = new Map();

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const n = cells[ny * width + nx];
          if (!n) continue;
          neighbors.push(n);
          neighborCounts.set(n.code, (neighborCounts.get(n.code) || 0) + 1);
        }
      }

      if (neighbors.length === 0) continue;

      let sameCount = 0;
      for (const n of neighbors) {
        if (n.code === cell.code) sameCount++;
      }

      if (sameCount <= maxIslandSize - 1) {
        let bestCode = null, bestCount = 0;
        for (const [code, count] of neighborCounts) {
          if (code !== cell.code && count > bestCount) {
            bestCount = count; bestCode = code;
          }
        }
        if (bestCode) {
          const replacement = neighbors.find((n) => n.code === bestCode);
          cells[i] = replacement;
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
}

function removeIsolatedPixelsProtected(cells, width, height, maxIslandSize, protectedMask) {
  const total = width * height;

  for (let passes = 0; passes < 2; passes++) {
    let changed = false;
    for (let i = 0; i < total; i++) {
      if (protectedMask?.[i]) continue;
      const cell = cells[i];
      if (!cell) continue;

      const x = i % width;
      const y = (i - x) / width;
      const neighborCounts = new Map();
      let sameCount = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const ni = ny * width + nx;
          const neighbor = cells[ni];
          if (!neighbor || protectedMask?.[ni]) continue;
          if (neighbor.code === cell.code) {
            sameCount += 1;
          } else {
            neighborCounts.set(neighbor.code, (neighborCounts.get(neighbor.code) || 0) + 1);
          }
        }
      }

      if (sameCount > maxIslandSize - 1 || neighborCounts.size === 0) continue;
      let bestCode = null;
      let bestCount = 0;
      for (const [code, count] of neighborCounts) {
        if (count > bestCount) {
          bestCode = code;
          bestCount = count;
        }
      }
      const replacement = state.palette.find((color) => color.code === bestCode);
      if (!replacement) continue;
      cells[i] = replacement;
      changed = true;
    }
    if (!changed) break;
  }
}

function mergeSmallRegions(cells, width, height, minSize) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const regionMap = new Int32Array(total).fill(-1);
  const regions = [];
  let regionId = 0;

  for (let i = 0; i < total; i++) {
    if (visited[i] || !cells[i]) continue;
    const code = cells[i].code;
    const queue = [i];
    const members = [];
    visited[i] = 1;

    while (queue.length > 0) {
      const idx = queue.pop();
      members.push(idx);
      regionMap[idx] = regionId;
      const x = idx % width, y = (idx - x) / width;

      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        if (visited[ni] || !cells[ni] || cells[ni].code !== code) continue;
        visited[ni] = 1;
        queue.push(ni);
      }
    }

    regions.push({ id: regionId, code, members });
    regionId++;
  }

  for (const region of regions) {
    if (region.members.length >= minSize) continue;

    const neighborCodes = new Map();
    for (const idx of region.members) {
      const x = idx % width, y = (idx - x) / width;
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        const n = cells[ni];
        if (!n || n.code === region.code) continue;
        neighborCodes.set(n.code, (neighborCodes.get(n.code) || 0) + 1);
      }
    }

    if (neighborCodes.size === 0) continue;

    let bestCode = null, bestCount = 0;
    for (const [code, count] of neighborCodes) {
      if (count > bestCount) { bestCount = count; bestCode = code; }
    }

    const replacement = state.palette.find((c) => c.code === bestCode);
    if (!replacement) continue;

    for (const idx of region.members) {
      cells[idx] = replacement;
    }
  }
}

function mergeSmallRegionsProtected(cells, width, height, minSize, protectedMask) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const regions = [];

  for (let i = 0; i < total; i++) {
    if (visited[i] || protectedMask?.[i] || !cells[i]) continue;
    const code = cells[i].code;
    const queue = [i];
    const members = [];
    visited[i] = 1;

    while (queue.length > 0) {
      const idx = queue.pop();
      members.push(idx);
      const x = idx % width;
      const y = (idx - x) / width;
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        if (visited[ni] || protectedMask?.[ni] || !cells[ni] || cells[ni].code !== code) continue;
        visited[ni] = 1;
        queue.push(ni);
      }
    }

    regions.push({ code, members });
  }

  for (const region of regions) {
    if (region.members.length >= minSize) continue;
    const neighborCodes = new Map();
    for (const idx of region.members) {
      const x = idx % width;
      const y = (idx - x) / width;
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        const neighbor = cells[ni];
        if (!neighbor || protectedMask?.[ni] || neighbor.code === region.code) continue;
        neighborCodes.set(neighbor.code, (neighborCodes.get(neighbor.code) || 0) + 1);
      }
    }

    let bestCode = null;
    let bestCount = 0;
    for (const [code, count] of neighborCodes) {
      if (count > bestCount) {
        bestCode = code;
        bestCount = count;
      }
    }
    const replacement = state.palette.find((color) => color.code === bestCode);
    if (!replacement) continue;
    for (const idx of region.members) {
      cells[idx] = replacement;
    }
  }
}

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToLab(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  let x = (0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb) / 0.95047;
  let y = (0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb) / 1.0;
  let z = (0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb) / 1.08883;

  const epsilon = 216 / 24389;
  const kappa = 24389 / 27;
  x = x > epsilon ? Math.cbrt(x) : (kappa * x + 16) / 116;
  y = y > epsilon ? Math.cbrt(y) : (kappa * y + 16) / 116;
  z = z > epsilon ? Math.cbrt(z) : (kappa * z + 16) / 116;

  return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function ensureLab(color) {
  if (color._lab) return color._lab;
  color._lab = rgbToLab(color.r, color.g, color.b);
  return color._lab;
}

function colorDistance(a, b) {
  const labA = ensureLab(a);
  const labB = ensureLab(b);
  const dL = labA.L - labB.L;
  const da = labA.a - labB.a;
  const db = labA.b - labB.b;
  return dL * dL + da * da + db * db;
}

function renderPreview(pattern) {
  if (!pattern) return;

  drawPatternToCanvas(els.patternCanvas, pattern, {
    cellSize: getPreviewCellSize(pattern.width),
    includeLegend: false,
    includeHeader: false,
    showCodes: true,
    showGrid: true,
  });

  els.patternCanvas.hidden = false;
  els.patternEmpty.hidden = true;
  els.patternMeta.hidden = false;
  els.patternMeta.textContent = `${pattern.width} x ${pattern.height} · ${pattern.colorCount} 色`;

  if (state.editor.enabled) {
    const showSourceUnderlay = Boolean(state.editor.showSourceUnderlay && state.image);
    drawPatternToCanvas(els.editorCanvas, pattern, {
      cellSize: getActivePreviewCellSize(),
      includeLegend: false,
      includeHeader: false,
      showCodes: state.editor.showCodes,
      showGrid: state.editor.showGrid,
      showPixels: state.editor.showPixels,
      selection: state.editor.selection,
      sourceImage: showSourceUnderlay ? state.image : null,
      sourceCrop: showSourceUnderlay ? state.sourceCrop : null,
      sourceOpacity: 0.72,
      cellOpacity: showSourceUnderlay ? 0.82 : 1,
    });
    els.editorCanvas.hidden = false;
    els.editorEmpty.hidden = true;
  }
}

function renderStats(pattern) {
  els.summaryStats.innerHTML = `
    <span>总尺寸：${pattern.width} x ${pattern.height}</span>
    <span>总豆数：${pattern.beadCount.toLocaleString("zh-CN")}</span>
    <span>颜色数：${pattern.colorCount}</span>
  `;

  if (pattern.stats.length === 0) {
    els.materialsTable.innerHTML = '<tr><td colspan="5" class="empty-table">暂无统计</td></tr>';
    return;
  }

  els.materialsTable.innerHTML = pattern.stats.map((item) => `
    <tr>
      <td><span class="swatch" style="background:${item.hex}"></span></td>
      <td><strong>${item.code}</strong></td>
      <td>${item.hex}</td>
      <td>${item.count.toLocaleString("zh-CN")}</td>
      <td>${Math.ceil(item.count * 1.05).toLocaleString("zh-CN")}</td>
    </tr>
  `).join("");
}

function drawPatternToCanvas(canvas, pattern, options) {
  const {
    cellSize,
    includeLegend,
    includeHeader,
    showCodes = true,
    showGrid = true,
    showPixels = true,
    selection = null,
    sourceImage = null,
    sourceCrop = null,
    sourceOpacity = 0.24,
    cellOpacity = 1,
  } = options;

  const numberFontSize = Math.max(8, Math.min(14, Math.floor(cellSize * 0.5)));
  const numberMargin = includeHeader ? Math.max(20, numberFontSize * 2 + 4) : 0;
  const padding = includeHeader ? 36 : 0;
  const headerHeight = includeHeader ? 64 : 0;
  const gridWidth = pattern.width * cellSize;
  const gridHeight = pattern.height * cellSize;

  const legendCols = Math.max(1, Math.min(pattern.stats.length || 1, Math.max(2, Math.floor((gridWidth + numberMargin * 2) / 180))));
  const legendRows = includeLegend ? Math.ceil(pattern.stats.length / legendCols) : 0;
  const legendItemH = 26;
  const legendBlockH = includeLegend ? 40 + legendRows * legendItemH + 30 : 0;

  const totalW = padding * 2 + numberMargin * 2 + gridWidth;
  const totalH = padding * 2 + headerHeight + numberMargin * 2 + gridHeight + legendBlockH;

  canvas.width = totalW;
  canvas.height = totalH;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridX = padding + numberMargin;
  const gridY = padding + headerHeight + numberMargin;

  if (includeHeader) {
    ctx.fillStyle = "#2b2118";
    ctx.font = "700 22px system-ui, sans-serif";
    ctx.fillText("MARD 拼豆图纸", padding, padding + 22);
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillStyle = "#74695d";
    ctx.fillText(`尺寸：${pattern.width} x ${pattern.height} · 总豆数：${pattern.beadCount} · 颜色数：${pattern.colorCount}`, padding, padding + 44);

    drawRowColNumbers(ctx, pattern, gridX, gridY, cellSize, numberFontSize);
  }

  if (sourceImage) {
    drawSourceUnderlay(ctx, sourceImage, sourceCrop, gridX, gridY, gridWidth, gridHeight, sourceOpacity);
  }
  drawGrid(ctx, pattern, gridX, gridY, cellSize, {
    showCodes,
    showGrid,
    showPixels,
    cellOpacity,
    hasSourceUnderlay: Boolean(sourceImage),
  });
  drawSelection(ctx, selection, gridX, gridY, cellSize);

  if (includeLegend) {
    drawBottomLegend(ctx, pattern, padding, gridY + gridHeight + numberMargin + 16, totalW - padding * 2, legendCols);
  }
}

function drawSourceUnderlay(ctx, image, crop, x, y, width, height, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  if (crop) {
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
  } else {
    ctx.drawImage(image, x, y, width, height);
  }
  ctx.restore();
}

function drawRowColNumbers(ctx, pattern, gridX, gridY, cellSize, fontSize) {
  ctx.fillStyle = "#74695d";
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let col = 0; col < pattern.width; col++) {
    const x = gridX + col * cellSize + cellSize / 2;
    ctx.fillText(String(col + 1), x, gridY - fontSize - 2);
    ctx.fillText(String(col + 1), x, gridY + pattern.height * cellSize + fontSize + 2);
  }

  ctx.textAlign = "right";
  for (let row = 0; row < pattern.height; row++) {
    const y = gridY + row * cellSize + cellSize / 2;
    ctx.fillText(String(row + 1), gridX - 4, y);
  }

  ctx.textAlign = "left";
  for (let row = 0; row < pattern.height; row++) {
    const y = gridY + row * cellSize + cellSize / 2;
    ctx.fillText(String(row + 1), gridX + pattern.width * cellSize + 4, y);
  }
}

function drawGrid(ctx, pattern, offsetX, offsetY, cellSize, options = {}) {
  const { showCodes = true, showGrid = true, showPixels = true, cellOpacity = 1, hasSourceUnderlay = false } = options;
  const showText = showPixels && showCodes && cellSize >= 14;
  const showFullCode = cellSize >= 22;

  for (let row = 0; row < pattern.height; row += 1) {
    for (let col = 0; col < pattern.width; col += 1) {
      const cell = pattern.cells[row * pattern.width + col];
      const x = offsetX + col * cellSize;
      const y = offsetY + row * cellSize;

      if (!showPixels) {
        if (!hasSourceUnderlay) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      } else if (cell) {
        ctx.save();
        ctx.globalAlpha = cellOpacity;
        ctx.fillStyle = cell.hex;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.restore();
      } else if (hasSourceUnderlay) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.fillRect(x, y, cellSize, cellSize);
      } else {
        drawTransparentCell(ctx, x, y, cellSize);
      }

      if (showGrid) {
        ctx.strokeStyle = "rgba(43, 33, 24, 0.24)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize, cellSize);
      }

      if (cell && showText) {
        ctx.fillStyle = cell.luminance > 0.58 ? "#201814" : "#ffffff";
        ctx.font = `${Math.max(8, Math.floor(cellSize * 0.32))}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = showFullCode ? cell.code : cell.code.replace(/[A-Z]+/, "");
        ctx.fillText(label, x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
}

function drawSelection(ctx, selection, offsetX, offsetY, cellSize) {
  const rect = normalizeSelection(selection);
  if (!rect) return;

  ctx.save();
  ctx.strokeStyle = "#e66b3c";
  ctx.lineWidth = Math.max(2, Math.floor(cellSize * 0.12));
  ctx.setLineDash([Math.max(4, cellSize * 0.4), Math.max(3, cellSize * 0.25)]);
  ctx.strokeRect(
    offsetX + rect.left * cellSize + 1,
    offsetY + rect.top * cellSize + 1,
    rect.width * cellSize - 2,
    rect.height * cellSize - 2,
  );
  ctx.fillStyle = "rgba(230, 107, 60, 0.12)";
  ctx.fillRect(
    offsetX + rect.left * cellSize,
    offsetY + rect.top * cellSize,
    rect.width * cellSize,
    rect.height * cellSize,
  );
  ctx.restore();
}

function drawTransparentCell(ctx, x, y, cellSize) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, cellSize, cellSize);
  ctx.fillStyle = "#eeeeee";
  const half = cellSize / 2;
  ctx.fillRect(x, y, half, half);
  ctx.fillRect(x + half, y + half, half, half);
}

function drawBottomLegend(ctx, pattern, x, y, availableWidth, cols) {
  const colWidth = Math.floor(availableWidth / cols);
  const itemH = 26;

  ctx.fillStyle = "#2b2118";
  ctx.font = "700 14px system-ui, sans-serif";

  let row = 0, col = 0;
  for (const item of pattern.stats) {
    const ix = x + col * colWidth;
    const iy = y + row * itemH;

    ctx.fillStyle = item.hex;
    ctx.fillRect(ix, iy, 18, 18);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(ix, iy, 18, 18);

    ctx.fillStyle = "#2b2118";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(item.code, ix + 24, iy + 9);

    ctx.fillStyle = "#74695d";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(`(${item.count})`, ix + 68, iy + 9);

    col++;
    if (col >= cols) { col = 0; row++; }
  }

  const footerY = y + (row + (col > 0 ? 1 : 0)) * itemH + 12;
  ctx.fillStyle = "#999";
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`总豆数：${pattern.beadCount} · MARD 291 色值为社区整理参考，实物可能存在色差`, x, footerY);
}

function handleEditorBack() {
  const targetView = state.reopenMode === "editor-only" ? "history" : "workspace";
  exitEditorView();
  setView(targetView);
}

function updateEditorBackButton() {
  const label = els.backToWorkspaceBtn?.querySelector("span");
  if (!label) return;
  label.textContent = state.reopenMode === "editor-only" ? "返回我的图纸" : "返回";
}

function clearHistorySession() {
  state.historyEntryId = null;
  state.reopenMode = null;
  updateEditorBackButton();
  saveViewSession();
}

function startNewProject() {
  clearHistorySession();
  try {
    resetTool();
  } catch (error) {
    console.error("resetTool failed during startNewProject", error);
    resetToolSafe();
  }
  setView("workspace");
  setStatus("已创建新图纸，请上传图片或点击「自定义绘图」。");
}

let historyDbPromise = null;

function openHistoryDb() {
  if (!historyDbPromise) {
    historyDbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(HISTORY_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(HISTORY_STORE)) {
          db.createObjectStore(HISTORY_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return historyDbPromise;
}

async function initHistoryStore() {
  if (!window.indexedDB) return;
  await openHistoryDb();
  await pruneExpiredHistory();
}

function createHistoryId() {
  return crypto.randomUUID?.() || `h-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function historyPut(entry) {
  if (!window.indexedDB) return;
  const db = await openHistoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, "readwrite");
    tx.objectStore(HISTORY_STORE).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function historyGet(id) {
  if (!window.indexedDB) return null;
  const db = await openHistoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, "readonly");
    const request = tx.objectStore(HISTORY_STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function historyGetAll() {
  if (!window.indexedDB) return [];
  const db = await openHistoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, "readonly");
    const request = tx.objectStore(HISTORY_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function historyDelete(id) {
  if (!window.indexedDB) return;
  const db = await openHistoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, "readwrite");
    tx.objectStore(HISTORY_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getHistoryRetentionMs(entry) {
  return entry.editedAt ? RETENTION_EDITED_MS : RETENTION_GENERATED_MS;
}

function isHistoryEntryExpired(entry, now = Date.now()) {
  const anchor = entry.editedAt || entry.createdAt;
  return now - anchor > getHistoryRetentionMs(entry);
}

async function pruneExpiredHistory() {
  const entries = await historyGetAll();
  const now = Date.now();
  await Promise.all(
    entries
      .filter((entry) => isHistoryEntryExpired(entry, now))
      .map((entry) => historyDelete(entry.id)),
  );
}

async function getRecentHistoryEntries(limit = 4) {
  await pruneExpiredHistory();
  return (await historyGetAll())
    .filter((entry) => !isHistoryEntryExpired(entry))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

function handleRecentPatternsClick(event) {
  const newCard = event.target.closest("[data-recent-new]");
  if (newCard) {
    startNewProject();
    return;
  }

  const card = event.target.closest("[data-recent-id]");
  if (card) {
    openHistoryEntry(card.dataset.recentId);
  }
}

function renderRecentNewCard() {
  if (!els.recentPatternsRow) return;

  els.recentPatternsRow.innerHTML = `
    <button type="button" class="recent-card recent-card-new" data-recent-new>
      <span class="recent-card-plus" aria-hidden="true">+</span>
      <span class="recent-card-label">新建图纸</span>
    </button>
  `;
}

async function renderRecentPatterns() {
  if (!els.recentPatternsRow) return;

  const newCard = `
    <button type="button" class="recent-card recent-card-new" data-recent-new>
      <span class="recent-card-plus" aria-hidden="true">+</span>
      <span class="recent-card-label">新建图纸</span>
    </button>
  `;

  renderRecentNewCard();

  let entries = [];
  try {
    entries = await getRecentHistoryEntries(4);
  } catch (error) {
    console.error(error);
  }

  const previewCards = entries.map((entry) => {
    const thumb = entry.thumbDataUrl
      ? `<img src="${entry.thumbDataUrl}" alt="" />`
      : "";
    return `
      <button type="button" class="recent-card" data-recent-id="${entry.id}">
        <div class="recent-card-preview">${thumb}</div>
        <div class="recent-card-foot">
          <div class="recent-card-title">${escapeHtml(entry.title)}</div>
          <div class="recent-card-meta">${entry.pattern.width}×${entry.pattern.height} · ${formatHistoryDate(entry.updatedAt)}</div>
        </div>
      </button>
    `;
  });

  els.recentPatternsRow.innerHTML = newCard + previewCards.join("");
}

function patternToSnapshot(pattern) {
  return {
    width: pattern.width,
    height: pattern.height,
    codes: pattern.cells.map((cell) => cell?.code || null),
    generatedAt: pattern.generatedAt,
  };
}

function patternFromSnapshot(snapshot) {
  const cells = snapshot.codes.map((code) => {
    if (!code) return null;
    return state.palette.find((color) => color.code === code) || null;
  });
  return buildPatternFromCells(
    snapshot.width,
    snapshot.height,
    cells,
    snapshot.generatedAt ? new Date(snapshot.generatedAt) : new Date(),
  );
}

function getWorkspaceSettings() {
  return {
    width: Number(els.widthSlider.value),
    colorLimit: els.colorLimit.value,
    colorMergeLevel: Number(els.colorMergeLevel.value),
    edgeEnhanceLevel: Number(els.edgeEnhanceLevel.value),
    alphaMode: els.alphaModes.find((radio) => radio.checked)?.value || "keep",
    bgTolerance: getBgTolerance(),
    outlineEnabled: els.outlineEnabled.checked,
    outlineColor: els.outlineColorSelect?.value || "",
    dither: els.dither.checked,
  };
}

function applyWorkspaceSettings(settings) {
  if (!settings) return;

  els.widthSlider.value = String(settings.width ?? 29);
  updateWidthLabel();
  els.colorLimit.value = settings.colorLimit ?? "32";
  els.colorMergeLevel.value = String(settings.colorMergeLevel ?? 0);
  updateColorMergeLabel();
  els.edgeEnhanceLevel.value = String(settings.edgeEnhanceLevel ?? 0);
  updateEdgeEnhanceLabel();
  if (els.bgToleranceLevel) {
    els.bgToleranceLevel.value = String(settings.bgTolerance ?? 35);
  }
  updateBgToleranceLabel();
  els.outlineEnabled.checked = Boolean(settings.outlineEnabled);
  syncOutlineColorRow();
  if (settings.outlineColor && els.outlineColorSelect) {
    els.outlineColorSelect.value = settings.outlineColor;
  }
  els.dither.checked = Boolean(settings.dither);
  const alpha = els.alphaModes.find((radio) => radio.value === settings.alphaMode);
  if (alpha) {
    alpha.checked = true;
  }
  syncBgToleranceRow();
  updateEstimate();
}

function getHistoryTitle() {
  if (state.imageFile?.name) {
    return state.imageFile.name;
  }
  if (!state.image && state.pattern) {
    return `空白画布 ${state.pattern.width}×${state.pattern.height}`;
  }
  if (state.pattern) {
    return `图纸 ${state.pattern.width}×${state.pattern.height}`;
  }
  return "未命名图纸";
}

async function captureSourceDataUrl() {
  if (!state.image) return null;

  try {
    const maxSide = 960;
    const width = state.image.naturalWidth;
    const height = state.image.naturalHeight;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(state.image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch (error) {
    console.warn("历史记录原图压缩失败", error);
    return null;
  }
}

function createPatternThumbnail(pattern) {
  if (!pattern) return null;

  const canvas = document.createElement("canvas");
  const cell = Math.max(1, Math.floor(72 / Math.max(pattern.width, pattern.height)));
  canvas.width = pattern.width * cell;
  canvas.height = pattern.height * cell;
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < pattern.cells.length; i += 1) {
    const cellColor = pattern.cells[i];
    const x = (i % pattern.width) * cell;
    const y = Math.floor(i / pattern.width) * cell;
    ctx.fillStyle = cellColor?.hex || "#f5f4f1";
    ctx.fillRect(x, y, cell, cell);
  }

  return canvas.toDataURL("image/png");
}

async function buildHistoryEntryFromState(overrides = {}) {
  const existing = state.historyEntryId ? await historyGet(state.historyEntryId) : null;
  const currentSourceDataUrl = await captureSourceDataUrl();
  const sourceDataUrl = currentSourceDataUrl || existing?.sourceDataUrl || null;

  return {
    id: state.historyEntryId || createHistoryId(),
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
    editedAt: overrides.editedAt !== undefined ? overrides.editedAt : (existing?.editedAt ?? null),
    title: overrides.title || existing?.title || getHistoryTitle(),
    pattern: patternToSnapshot(state.pattern),
    settings: getWorkspaceSettings(),
    sourceCrop: state.sourceCrop,
    sourceDataUrl,
    thumbDataUrl: createPatternThumbnail(state.pattern),
  };
}

async function saveHistoryAfterGenerate() {
  if (!state.pattern || !window.indexedDB) return;

  const isNewProject = !state.historyEntryId;
  if (isNewProject) {
    state.historyEntryId = createHistoryId();
  }
  const entry = await buildHistoryEntryFromState(isNewProject ? { editedAt: null } : {});
  state.historyEntryId = entry.id;
  await historyPut(entry);
  await pruneExpiredHistory();
  await renderRecentPatterns();
  saveViewSession();
}

async function saveHistoryAfterCustomDraw(width, height) {
  if (!state.pattern || !window.indexedDB) return;

  state.historyEntryId = createHistoryId();
  const entry = await buildHistoryEntryFromState({
    editedAt: Date.now(),
    title: `空白画布 ${width}×${height}`,
  });
  await historyPut(entry);
  await pruneExpiredHistory();
  await renderRecentPatterns();
  saveViewSession();
}

async function markCurrentHistoryEdited() {
  if (!state.historyEntryId || !state.pattern || !window.indexedDB) return;

  const entry = await historyGet(state.historyEntryId);
  if (!entry || entry.editedAt) return;

  entry.editedAt = Date.now();
  entry.updatedAt = Date.now();
  await historyPut(entry);
  await pruneExpiredHistory();
  if (state.activeView === "home") {
    await renderRecentPatterns();
  }
}

async function persistHistoryEntry() {
  if (!state.pattern || !state.historyEntryId || !window.indexedDB) return;

  const entry = await buildHistoryEntryFromState();
  if (state.editor.enabled && !entry.editedAt) {
    entry.editedAt = Date.now();
  }
  await historyPut(entry);
  await pruneExpiredHistory();
  if (state.activeView === "home") {
    await renderRecentPatterns();
  }
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function clearSourceImage() {
  state.image = null;
  state.imageFile = null;
  state.sourceCrop = null;
  if (state.sourceUrl && state.sourceUrl.startsWith("blob:")) {
    URL.revokeObjectURL(state.sourceUrl);
  }
  state.sourceUrl = "";
  els.sourcePreview.hidden = true;
  els.sourcePreview.removeAttribute("src");
  els.sourceEmpty.hidden = false;
  els.fileMeta.hidden = true;
  els.fileMeta.textContent = "";
  els.generateBtn.disabled = true;
}

async function loadSourceFromDataUrl(dataUrl, title) {
  const image = await loadImageFromDataUrl(dataUrl);
  state.image = image;
  state.imageFile = null;
  if (state.sourceUrl && state.sourceUrl.startsWith("blob:")) {
    URL.revokeObjectURL(state.sourceUrl);
  }
  state.sourceUrl = dataUrl;
  els.sourcePreview.src = dataUrl;
  els.sourcePreview.hidden = false;
  els.sourceEmpty.hidden = true;
  els.fileMeta.hidden = false;
  els.fileMeta.textContent = `${title || "历史原图"} · ${image.naturalWidth} x ${image.naturalHeight}`;
  els.generateBtn.disabled = false;
}

async function loadHistoryEntry(entry) {
  applyWorkspaceSettings(entry.settings);
  state.sourceCrop = entry.sourceCrop || null;
  state.pattern = patternFromSnapshot(entry.pattern);
  resetEditorForPattern(state.pattern);
  renderPreview(state.pattern);
  renderStats(state.pattern);
  renderEditorPalette();
  els.downloadBtn.disabled = false;
  els.editToggleBtn.disabled = false;
  els.patternMeta.hidden = false;
  els.patternMeta.textContent = `${state.pattern.width}×${state.pattern.height} · ${state.pattern.colorCount} 色`;

  if (entry.sourceDataUrl) {
    await loadSourceFromDataUrl(entry.sourceDataUrl, entry.title);
  } else {
    clearSourceImage();
  }

  updateSourcePreviewFloat();
  updateEstimate();
}

async function openHistoryEntry(id) {
  const entry = await historyGet(id);
  if (!entry || isHistoryEntryExpired(entry)) {
    if (entry) {
      await historyDelete(entry.id);
    }
    setStatus("记录不存在或已超过保留期限。", "error");
    await renderHistoryView();
    return;
  }

  state.historyEntryId = id;
  await loadHistoryEntry(entry);

  if (entry.editedAt) {
    state.reopenMode = null;
    updateEditorBackButton();
    enterEditorView();
    setStatus("已从我的图纸进入编辑，可返回生成图纸页继续查看。", "success");
  } else {
    state.reopenMode = null;
    updateEditorBackButton();
    setView("workspace");
    setStatus("已打开图纸，可查看生成结果或进入编辑。", "success");
  }
}

async function deleteHistoryEntry(id) {
  const entry = await historyGet(id);
  if (!entry) {
    await renderHistoryView();
    return;
  }

  const confirmed = window.confirm(`确定删除「${entry.title}」吗？删除后无法恢复。`);
  if (!confirmed) return;

  await historyDelete(id);
  if (state.historyEntryId === id) {
    clearHistorySession();
  }
  await renderHistoryView();
  await renderRecentPatterns();
  setStatus("图纸已删除。", "success");
}

function formatHistoryDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function renderHistoryView() {
  if (!els.historyList || !els.historyEmpty) return;

  const entries = await getRecentHistoryEntries(500);

  els.historyEmpty.hidden = entries.length > 0;
  els.historyList.hidden = entries.length === 0;

  if (entries.length === 0) {
    els.historyList.innerHTML = "";
    return;
  }

  els.historyList.innerHTML = entries.map((entry) => {
    const edited = Boolean(entry.editedAt);
    const badgeClass = edited ? "history-badge-edited" : "history-badge-generated";
    const badgeText = edited ? "已编辑 · 保留 30 天" : "仅生成 · 保留 7 天";
    const thumb = entry.thumbDataUrl
      ? `<img class="history-thumb" src="${entry.thumbDataUrl}" alt="" />`
      : '<div class="history-thumb" aria-hidden="true"></div>';

    return `
      <article class="history-card" data-history-id="${entry.id}" tabindex="0">
        ${thumb}
        <div class="history-card-body">
          <div class="history-card-title">${escapeHtml(entry.title)}</div>
          <div class="history-card-meta">${formatHistoryDate(entry.updatedAt)} · ${entry.pattern.width}×${entry.pattern.height}</div>
          <span class="history-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="history-card-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-open-history="${entry.id}">打开</button>
          <button type="button" class="btn btn-ghost btn-sm history-delete-btn" data-delete-history="${entry.id}">删除</button>
        </div>
      </article>
    `;
  }).join("");

  els.historyList.querySelectorAll("[data-open-history]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openHistoryEntry(button.dataset.openHistory);
    });
  });

  els.historyList.querySelectorAll("[data-delete-history]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteHistoryEntry(button.dataset.deleteHistory);
    });
  });

  els.historyList.querySelectorAll(".history-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openHistoryEntry(card.dataset.historyId);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHistoryEntry(card.dataset.historyId);
      }
    });
  });
}

function downloadPattern() {
  if (!state.pattern) {
    return;
  }

  try {
    const canvas = document.createElement("canvas");
    const cellSize = getDownloadCellSize(state.pattern);
    drawPatternToCanvas(canvas, state.pattern, {
      cellSize,
      includeLegend: true,
      includeHeader: true,
    });

    const link = document.createElement("a");
    link.download = `mard-pattern-${state.pattern.width}x${state.pattern.height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("PNG 已生成并开始下载。", "success");
  } catch (error) {
    setStatus("下载失败，请稍后重试或降低图纸尺寸。", "error");
    console.error(error);
  }
}

function resetTool() {
  clearHistorySession();
  state.image = null;
  state.imageFile = null;
  state.sourceCrop = null;
  state.pattern = null;

  if (els.imageInput) {
    els.imageInput.value = "";
  }
  if (els.widthSlider) {
    els.widthSlider.value = "29";
  }
  updateWidthLabel();
  if (els.colorLimit) {
    els.colorLimit.value = "32";
  }
  if (els.colorMergeLevel) {
    els.colorMergeLevel.value = "0";
  }
  updateColorMergeLabel();
  if (els.edgeEnhanceLevel) {
    els.edgeEnhanceLevel.value = "0";
  }
  updateEdgeEnhanceLabel();
  if (els.bgToleranceLevel) {
    els.bgToleranceLevel.value = "35";
  }
  updateBgToleranceLabel();
  if (els.outlineEnabled) {
    els.outlineEnabled.checked = false;
  }
  syncOutlineColorRow();
  if (els.outlineColorSelect?.options.length) {
    els.outlineColorSelect.value = state.palette.some((c) => c.code === "H7") ? "H7" : els.outlineColorSelect.options[0].value;
  }
  if (els.dither) {
    els.dither.checked = false;
  }
  const alphaKeep = els.alphaModes.find((radio) => radio.value === "keep");
  if (alphaKeep) {
    alphaKeep.checked = true;
  }
  syncBgToleranceRow();
  updateEstimate();
  clearPattern();
  if (els.sourcePreview) {
    els.sourcePreview.hidden = true;
    els.sourcePreview.removeAttribute("src");
  }
  if (els.sourceEmpty) {
    els.sourceEmpty.hidden = false;
  }
  if (els.fileMeta) {
    els.fileMeta.hidden = true;
    els.fileMeta.textContent = "";
  }
  if (els.generateBtn) {
    els.generateBtn.disabled = true;
  }
  disableEditor();

  if (state.sourceUrl) {
    URL.revokeObjectURL(state.sourceUrl);
    state.sourceUrl = "";
  }

  setStatus("上传一张图片，生成你的第一张拼豆图纸。");
}

function resetToolSafe() {
  state.image = null;
  state.imageFile = null;
  state.sourceCrop = null;
  state.pattern = null;
  clearPattern();
  disableEditor();
  if (state.sourceUrl) {
    URL.revokeObjectURL(state.sourceUrl);
    state.sourceUrl = "";
  }
}

function clearPattern() {
  state.pattern = null;
  disableEditor();
  els.patternCanvas.hidden = true;
  els.patternEmpty.hidden = false;
  els.patternMeta.hidden = true;
  els.patternMeta.textContent = "";
  els.downloadBtn.disabled = true;
  els.summaryStats.innerHTML = `
    <span>总尺寸：-</span>
    <span>总豆数：-</span>
    <span>颜色数：-</span>
  `;
  els.materialsTable.innerHTML = '<tr><td colspan="5" class="empty-table">暂无统计</td></tr>';
}

function disableEditor() {
  state.editor.enabled = false;
  state.editor.history = [];
  state.editor.future = [];
  state.editor.selection = null;
  state.editor.dragStart = null;
  state.editor.hoverCell = null;

  if (els.editToggleBtn) {
    els.editToggleBtn.disabled = true;
    els.editToggleBtn.textContent = "进入编辑 →";
  }
  if (els.editorCanvas) {
    els.editorCanvas.hidden = true;
  }
  if (els.editorEmpty) {
    els.editorEmpty.hidden = false;
  }
  if (els.editorCanvasWrap) {
    els.editorCanvasWrap.classList.remove("editing");
  }
  if (els.hoverInfo) {
    els.hoverInfo.textContent = "悬停格子查看坐标";
  }
  if (els.showSourceUnderlay) {
    els.showSourceUnderlay.checked = false;
  }
  if (els.showPixels) {
    els.showPixels.checked = true;
  }
  state.editor.showSourceUnderlay = false;
  state.editor.showPixels = true;
  updateSourceUnderlayControl();
  state.editor.mergeFromCode = null;
  state.editor.mergeToCode = null;
  state.editor.mergePickTarget = null;
  state.editor.strokeActive = false;
  state.editor.spacePanning = false;
  endCanvasPan();
  setMergePickTarget(null);
  updateEditorPanCursor();
  if (els.mergeFromPick) els.mergeFromPick.disabled = true;
  if (els.mergeToPick) els.mergeToPick.disabled = true;
  if (els.mergeFromDisplay) {
    els.mergeFromDisplay.innerHTML = '<span class="merge-pick-placeholder">点击选择</span>';
  }
  if (els.mergeToDisplay) {
    els.mergeToDisplay.innerHTML = '<span class="merge-pick-placeholder">点击选择</span>';
  }
  if (els.mergeHint) {
    els.mergeHint.textContent = "生成图纸后可合并颜色";
  }
  if (els.mergeColorsBtn) {
    els.mergeColorsBtn.disabled = true;
  }
  updateEditorButtons();
  updateSelectionButtons();
}

function buildResultWarning(pattern) {
  if (pattern.colorCount > 48) {
    return "当前图纸颜色较多，制作难度可能偏高。可以降低颜色数量或减少图纸尺寸。";
  }

  if (pattern.beadCount > 2500) {
    return "当前图纸总豆数较多，制作时间可能较长。";
  }

  if (pattern.width > 58) {
    return "当前图纸宽度较大，后续版本会更适合使用分板打印。";
  }

  return "";
}

function getRequestedWidth() {
  const raw = els.widthInput?.value ?? els.widthSlider.value;
  return Number.parseInt(raw, 10);
}

function getTargetHeight(width) {
  return Math.max(1, Math.round((state.image.naturalHeight / state.image.naturalWidth) * width));
}

function getAlphaMode() {
  return els.alphaModes.find((radio) => radio.checked)?.value || "keep";
}

function getPreviewCellSize(width) {
  return Math.max(8, Math.min(24, Math.floor(900 / width)));
}

function getActivePreviewCellSize() {
  if (!state.pattern) return 8;
  return Math.round(getPreviewCellSize(state.pattern.width) * (state.editor.enabled ? state.editor.zoom : 1));
}

function getDownloadCellSize(pattern) {
  const longestSide = Math.max(pattern.width, pattern.height);
  if (longestSide <= 40) {
    return 28;
  }
  if (longestSide <= 80) {
    return 18;
  }
  if (longestSide <= 130) {
    return 12;
  }
  return 8;
}

function getLuminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function setStatus(message, type = "") {
  els.statusMessage.textContent = message;
  els.statusMessage.classList.toggle("error", type === "error");
  els.statusMessage.classList.toggle("success", type === "success");
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

