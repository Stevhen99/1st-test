/**
 * NutriTrack - Pure Vanilla JavaScript Calorie & Macro Tracker
 * Persistent client-side storage via localStorage.
 */

// ============================================================================
// Default Constants & Presets
// ============================================================================
const DEFAULT_GOALS = {
  calories: 2000,
  protein: 140,
  carbs: 220,
  fat: 65,
  water: 2500
};

const FOOD_PRESETS = [
  { name: 'Large Egg (Boiled/Fried)', serving: '1 egg (50g)', calories: 74, protein: 6.3, carbs: 0.4, fat: 5.0, category: 'breakfast' },
  { name: 'Rolled Oats (Dry)', serving: '1/2 cup (40g)', calories: 150, protein: 5.0, carbs: 27.0, fat: 2.5, category: 'breakfast' },
  { name: 'Greek Yogurt (0% Fat)', serving: '1 cup (170g)', calories: 100, protein: 17.0, carbs: 6.0, fat: 0.7, category: 'breakfast' },
  { name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, category: 'snacks' },
  { name: 'Apple', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, category: 'snacks' },
  { name: 'Whole Wheat Bread', serving: '1 slice (38g)', calories: 90, protein: 4.0, carbs: 15.0, fat: 1.2, category: 'breakfast' },
  { name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 190, protein: 8.0, carbs: 7.0, fat: 16.0, category: 'snacks' },
  { name: 'Chicken Breast (Cooked)', serving: '150g', calories: 247, protein: 46.5, carbs: 0.0, fat: 5.4, category: 'lunch' },
  { name: 'White Rice (Cooked)', serving: '1 cup (158g)', calories: 205, protein: 4.2, carbs: 45.0, fat: 0.4, category: 'lunch' },
  { name: 'Brown Rice (Cooked)', serving: '1 cup (195g)', calories: 216, protein: 5.0, carbs: 45.0, fat: 1.8, category: 'lunch' },
  { name: 'Atlantic Salmon (Grilled)', serving: '150g', calories: 310, protein: 34.0, carbs: 0.0, fat: 18.0, category: 'dinner' },
  { name: 'Broccoli (Steamed)', serving: '1 cup (150g)', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, category: 'dinner' },
  { name: 'Avocado', serving: '1/2 medium (100g)', calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, category: 'lunch' },
  { name: 'Whey Protein Powder', serving: '1 scoop (30g)', calories: 120, protein: 24.0, carbs: 3.0, fat: 1.5, category: 'snacks' },
  { name: 'Mixed Almonds / Nuts', serving: '1 oz (28g)', calories: 164, protein: 6.0, carbs: 6.0, fat: 14.0, category: 'snacks' },
  { name: 'Canned Tuna in Water', serving: '1 can drained (120g)', calories: 130, protein: 28.0, carbs: 0.0, fat: 1.0, category: 'lunch' },
  { name: 'Sweet Potato (Baked)', serving: '1 medium (114g)', calories: 103, protein: 2.3, carbs: 24.0, fat: 0.2, category: 'dinner' },
  { name: 'Olive Oil', serving: '1 tbsp (14ml)', calories: 119, protein: 0.0, carbs: 0.0, fat: 13.5, category: 'dinner' },
  { name: 'Whole Milk', serving: '1 cup (240ml)', calories: 149, protein: 7.7, carbs: 11.7, fat: 8.0, category: 'breakfast' },
  { name: 'Cheddar Cheese', serving: '1 oz (28g)', calories: 115, protein: 7.0, carbs: 0.4, fat: 9.5, category: 'snacks' }
];

// ============================================================================
// State Management
// ============================================================================
class AppState {
  constructor() {
    this.currentDate = this.getLocalDateString(new Date());
    this.goals = this.loadGoals();
    this.logs = this.loadLogs();

    // If storage is completely empty, populate friendly seed data for today
    if (Object.keys(this.logs).length === 0) {
      this.seedInitialData();
    }
  }

  getLocalDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadGoals() {
    try {
      const stored = localStorage.getItem('nutritrack_goals');
      return stored ? { ...DEFAULT_GOALS, ...JSON.parse(stored) } : { ...DEFAULT_GOALS };
    } catch (e) {
      console.error('Error loading goals from localStorage', e);
      return { ...DEFAULT_GOALS };
    }
  }

  saveGoals(goals) {
    this.goals = goals;
    localStorage.setItem('nutritrack_goals', JSON.stringify(this.goals));
  }

  loadLogs() {
    try {
      const stored = localStorage.getItem('nutritrack_logs');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error loading logs from localStorage', e);
      return {};
    }
  }

  saveLogs() {
    localStorage.setItem('nutritrack_logs', JSON.stringify(this.logs));
  }

  getDayLog(dateStr) {
    if (!this.logs[dateStr]) {
      this.logs[dateStr] = {
        water: 0,
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        }
      };
    }
    return this.logs[dateStr];
  }

  seedInitialData() {
    const today = this.currentDate;
    this.logs[today] = {
      water: 1250,
      meals: {
        breakfast: [
          { id: 'seed-1', name: 'Rolled Oats with Milk', serving: '1 bowl', calories: 300, protein: 12.5, carbs: 40.0, fat: 6.0 },
          { id: 'seed-2', name: 'Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3 }
        ],
        lunch: [
          { id: 'seed-3', name: 'Chicken Breast (Cooked)', serving: '150g', calories: 247, protein: 46.5, carbs: 0.0, fat: 5.4 },
          { id: 'seed-4', name: 'White Rice (Cooked)', serving: '1 cup', calories: 205, protein: 4.2, carbs: 45.0, fat: 0.4 }
        ],
        dinner: [],
        snacks: [
          { id: 'seed-5', name: 'Greek Yogurt (0% Fat)', serving: '1 cup', calories: 100, protein: 17.0, carbs: 6.0, fat: 0.7 }
        ]
      }
    };
    this.saveLogs();
  }

  addFood(dateStr, mealCategory, foodItem) {
    const day = this.getDayLog(dateStr);
    const itemWithId = {
      ...foodItem,
      id: foodItem.id || 'f_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
    };
    if (!day.meals[mealCategory]) {
      day.meals[mealCategory] = [];
    }
    day.meals[mealCategory].push(itemWithId);
    this.saveLogs();
    return itemWithId;
  }

  updateFood(dateStr, mealCategory, foodId, updatedItem) {
    const day = this.getDayLog(dateStr);
    for (const cat in day.meals) {
      const idx = day.meals[cat].findIndex(item => item.id === foodId);
      if (idx !== -1) {
        day.meals[cat].splice(idx, 1);
        break;
      }
    }
    const finalItem = { ...updatedItem, id: foodId };
    if (!day.meals[mealCategory]) day.meals[mealCategory] = [];
    day.meals[mealCategory].push(finalItem);
    this.saveLogs();
  }

  deleteFood(dateStr, foodId) {
    const day = this.getDayLog(dateStr);
    for (const cat in day.meals) {
      const idx = day.meals[cat].findIndex(item => item.id === foodId);
      if (idx !== -1) {
        day.meals[cat].splice(idx, 1);
        this.saveLogs();
        return true;
      }
    }
    return false;
  }

  getFoodById(dateStr, foodId) {
    const day = this.getDayLog(dateStr);
    for (const cat in day.meals) {
      const item = day.meals[cat].find(f => f.id === foodId);
      if (item) return { item, category: cat };
    }
    return null;
  }

  updateWater(dateStr, delta) {
    const day = this.getDayLog(dateStr);
    day.water = Math.max(0, (day.water || 0) + delta);
    this.saveLogs();
    return day.water;
  }

  resetWater(dateStr) {
    const day = this.getDayLog(dateStr);
    day.water = 0;
    this.saveLogs();
    return 0;
  }
}

// Instantiate state
const state = new AppState();

// ============================================================================
// DOM References
// ============================================================================
const dom = {
  // Date
  datePicker: document.getElementById('datePicker'),
  dateDisplay: document.getElementById('dateDisplay'),
  prevDateBtn: document.getElementById('prevDateBtn'),
  nextDateBtn: document.getElementById('nextDateBtn'),
  todayBtn: document.getElementById('todayBtn'),

  // Overview / Calories
  calorieStatusBadge: document.getElementById('calorieStatusBadge'),
  caloriesConsumed: document.getElementById('caloriesConsumed'),
  calorieGaugeBar: document.getElementById('calorieGaugeBar'),
  caloriesRemaining: document.getElementById('caloriesRemaining'),
  remainingLabel: document.getElementById('remainingLabel'),
  calorieTarget: document.getElementById('calorieTarget'),

  // Macros
  proteinCurrent: document.getElementById('proteinCurrent'),
  proteinTarget: document.getElementById('proteinTarget'),
  proteinBar: document.getElementById('proteinBar'),
  carbsCurrent: document.getElementById('carbsCurrent'),
  carbsTarget: document.getElementById('carbsTarget'),
  carbsBar: document.getElementById('carbsBar'),
  fatCurrent: document.getElementById('fatCurrent'),
  fatTarget: document.getElementById('fatTarget'),
  fatBar: document.getElementById('fatBar'),

  // Water
  waterGoalPercent: document.getElementById('waterGoalPercent'),
  waterCurrent: document.getElementById('waterCurrent'),
  waterTarget: document.getElementById('waterTarget'),
  waterBar: document.getElementById('waterBar'),
  addWaterBtn: document.getElementById('addWaterBtn'),
  addWaterBigBtn: document.getElementById('addWaterBigBtn'),
  subWaterBtn: document.getElementById('subWaterBtn'),
  resetWaterBtn: document.getElementById('resetWaterBtn'),

  // Meals
  breakfastCalories: document.getElementById('breakfastCalories'),
  breakfastList: document.getElementById('breakfastList'),
  lunchCalories: document.getElementById('lunchCalories'),
  lunchList: document.getElementById('lunchList'),
  dinnerCalories: document.getElementById('dinnerCalories'),
  dinnerList: document.getElementById('dinnerList'),
  snacksCalories: document.getElementById('snacksCalories'),
  snacksList: document.getElementById('snacksList'),
  quickAddGlobalBtn: document.getElementById('quickAddGlobalBtn'),

  // Chart
  weeklyChart: document.getElementById('weeklyChart'),

  // Food Modal
  addFoodModal: document.getElementById('addFoodModal'),
  closeFoodModalBtn: document.getElementById('closeFoodModalBtn'),
  cancelFoodBtn: document.getElementById('cancelFoodBtn'),
  foodForm: document.getElementById('foodForm'),
  modalTitle: document.getElementById('modalTitle'),
  editEntryId: document.getElementById('editEntryId'),
  foodName: document.getElementById('foodName'),
  mealCategory: document.getElementById('mealCategory'),
  foodServing: document.getElementById('foodServing'),
  foodCalories: document.getElementById('foodCalories'),
  foodProtein: document.getElementById('foodProtein'),
  foodCarbs: document.getElementById('foodCarbs'),
  foodFat: document.getElementById('foodFat'),
  presetSearchInput: document.getElementById('presetSearchInput'),
  presetTargetMeal: document.getElementById('presetTargetMeal'),
  presetListContainer: document.getElementById('presetListContainer'),

  // Goals Modal
  goalsModal: document.getElementById('goalsModal'),
  openGoalsBtn: document.getElementById('openGoalsBtn'),
  closeGoalsModalBtn: document.getElementById('closeGoalsModalBtn'),
  cancelGoalsBtn: document.getElementById('cancelGoalsBtn'),
  goalsForm: document.getElementById('goalsForm'),
  targetCaloriesInput: document.getElementById('targetCaloriesInput'),
  targetProteinInput: document.getElementById('targetProteinInput'),
  targetCarbsInput: document.getElementById('targetCarbsInput'),
  targetFatInput: document.getElementById('targetFatInput'),
  targetWaterInput: document.getElementById('targetWaterInput'),

  // Data Actions
  exportDataBtn: document.getElementById('exportDataBtn'),
  importDataInput: document.getElementById('importDataInput'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  toastContainer: document.getElementById('toastContainer')
};

// ============================================================================
// Toast Notification Utility
// ============================================================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ============================================================================
// Date Formatting & Navigation
// ============================================================================
function formatDateHuman(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return targetDate.toLocaleDateString(undefined, options);
}

function updateDateUI() {
  dom.datePicker.value = state.currentDate;
  dom.dateDisplay.textContent = formatDateHuman(state.currentDate);
}

function changeDateByOffset(days) {
  const [y, m, d] = state.currentDate.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  state.currentDate = state.getLocalDateString(dt);
  renderAll();
}

// ============================================================================
// Render UI Components
// ============================================================================
function renderAll() {
  updateDateUI();
  renderGoalsTargets();
  renderDayOverview();
  renderMealLists();
  renderWeeklyChart();
}

function renderGoalsTargets() {
  dom.calorieTarget.textContent = state.goals.calories.toLocaleString();
  dom.proteinTarget.textContent = state.goals.protein;
  dom.carbsTarget.textContent = state.goals.carbs;
  dom.fatTarget.textContent = state.goals.fat;
  dom.waterTarget.textContent = state.goals.water.toLocaleString();
}

function calculateDayTotals(dateStr) {
  const day = state.getDayLog(dateStr);
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const mealKey in day.meals) {
    const list = day.meals[mealKey] || [];
    list.forEach(item => {
      totalCalories += Number(item.calories) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });
  }

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    water: day.water || 0
  };
}

function renderDayOverview() {
  const totals = calculateDayTotals(state.currentDate);
  const targetCals = state.goals.calories;

  // Calorie Values
  dom.caloriesConsumed.textContent = totals.calories.toLocaleString();
  const remaining = targetCals - totals.calories;

  // Circular gauge circle circumference = 2 * PI * 68 = 427.26
  const circumference = 2 * Math.PI * 68;
  const ratio = Math.min(totals.calories / targetCals, 1);
  const offset = circumference - (ratio * circumference);
  dom.calorieGaugeBar.style.strokeDasharray = `${circumference}`;
  dom.calorieGaugeBar.style.strokeDashoffset = `${offset}`;

  if (remaining >= 0) {
    dom.calorieGaugeBar.style.stroke = '#10b981';
    dom.caloriesRemaining.textContent = remaining.toLocaleString();
    dom.remainingLabel.textContent = 'kcal left';
    dom.calorieStatusBadge.className = 'status-badge badge-under';
    dom.calorieStatusBadge.textContent = 'On Track';
  } else {
    dom.calorieGaugeBar.style.stroke = '#ef4444';
    dom.caloriesRemaining.textContent = '+' + Math.abs(remaining).toLocaleString();
    dom.remainingLabel.textContent = 'kcal over';
    dom.calorieStatusBadge.className = 'status-badge badge-over';
    dom.calorieStatusBadge.textContent = 'Over Target';
  }

  // Macronutrients
  dom.proteinCurrent.textContent = totals.protein;
  const proteinPercent = Math.min((totals.protein / state.goals.protein) * 100, 100);
  dom.proteinBar.style.width = `${proteinPercent}%`;

  dom.carbsCurrent.textContent = totals.carbs;
  const carbsPercent = Math.min((totals.carbs / state.goals.carbs) * 100, 100);
  dom.carbsBar.style.width = `${carbsPercent}%`;

  dom.fatCurrent.textContent = totals.fat;
  const fatPercent = Math.min((totals.fat / state.goals.fat) * 100, 100);
  dom.fatBar.style.width = `${fatPercent}%`;

  // Hydration
  dom.waterCurrent.textContent = totals.water.toLocaleString();
  const waterPercent = Math.round((totals.water / state.goals.water) * 100);
  dom.waterGoalPercent.textContent = `${waterPercent}%`;
  dom.waterBar.style.width = `${Math.min(waterPercent, 100)}%`;
}

function renderMealLists() {
  const day = state.getDayLog(state.currentDate);
  const categories = ['breakfast', 'lunch', 'dinner', 'snacks'];

  categories.forEach(cat => {
    const listElem = dom[`${cat}List`];
    const calElem = dom[`${cat}Calories`];
    const items = day.meals[cat] || [];

    let mealCals = 0;
    items.forEach(item => {
      mealCals += Number(item.calories) || 0;
    });
    calElem.textContent = `${Math.round(mealCals)} kcal`;

    if (items.length === 0) {
      listElem.innerHTML = `<li class="empty-list-placeholder">No items logged for ${cat}</li>`;
      return;
    }

    listElem.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'food-item';
      li.innerHTML = `
        <div class="food-item-left">
          <span class="food-item-name">${escapeHTML(item.name)}</span>
          <span class="food-item-serving">${item.serving ? escapeHTML(item.serving) : '1 serving'}</span>
          <div class="food-item-macros">
            <span>P: ${item.protein || 0}g</span>
            <span>C: ${item.carbs || 0}g</span>
            <span>F: ${item.fat || 0}g</span>
          </div>
        </div>
        <div class="food-item-right">
          <span class="food-item-calories">${item.calories} kcal</span>
          <button class="delete-food-btn" title="Delete Item" data-id="${item.id}">&times;</button>
        </div>
      `;

      // Click to edit
      li.querySelector('.food-item-left').addEventListener('click', () => {
        openEditFoodModal(item.id);
      });

      // Delete handler
      li.querySelector('.delete-food-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.deleteFood(state.currentDate, item.id);
        renderDayOverview();
        renderMealLists();
        renderWeeklyChart();
        showToast(`Removed "${item.name}"`, 'info');
      });

      listElem.appendChild(li);
    });
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ============================================================================
// Weekly Chart Canvas Renderer (Pure Vanilla 2D Canvas)
// ============================================================================
function renderWeeklyChart() {
  const canvas = dom.weeklyChart;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Handle high-DPI screens
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.parentElement.clientWidth || 600;
  const height = 200;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  // Generate 7 days ending at current selected date
  const daysData = [];
  const [currY, currM, currD] = state.currentDate.split('-').map(Number);
  const anchorDate = new Date(currY, currM - 1, currD);

  for (let i = 6; i >= 0; i--) {
    const dt = new Date(anchorDate);
    dt.setDate(dt.getDate() - i);
    const dateStr = state.getLocalDateString(dt);
    const totals = calculateDayTotals(dateStr);
    daysData.push({
      dateStr,
      label: dt.toLocaleDateString(undefined, { weekday: 'short' }),
      shortDate: `${dt.getMonth() + 1}/${dt.getDate()}`,
      calories: totals.calories,
      isCurrent: dateStr === state.currentDate
    });
  }

  const target = state.goals.calories;
  const maxCalories = Math.max(target * 1.25, ...daysData.map(d => d.calories), 1000);

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Background Grid Lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';

  const gridSteps = 4;
  for (let s = 0; s <= gridSteps; s++) {
    const val = Math.round((maxCalories / gridSteps) * s);
    const y = paddingTop + chartHeight - (val / maxCalories) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    ctx.fillText(val.toString(), paddingLeft - 6, y + 3);
  }

  // Draw Goal Line
  const targetY = paddingTop + chartHeight - (target / maxCalories) * chartHeight;
  ctx.save();
  ctx.strokeStyle = '#ef4444';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, targetY);
  ctx.lineTo(width - paddingRight, targetY);
  ctx.stroke();
  ctx.restore();

  // Draw Bars
  const barCount = daysData.length;
  const totalBarSpace = chartWidth / barCount;
  const barWidth = Math.min(Math.max(totalBarSpace * 0.45, 16), 40);

  daysData.forEach((day, index) => {
    const xCenter = paddingLeft + (index * totalBarSpace) + (totalBarSpace / 2);
    const barX = xCenter - (barWidth / 2);
    const barH = (day.calories / maxCalories) * chartHeight;
    const barY = paddingTop + chartHeight - barH;

    // Bar Color
    if (day.calories > target) {
      ctx.fillStyle = '#f87171'; // red over target
    } else if (day.isCurrent) {
      ctx.fillStyle = '#10b981'; // active bright green
    } else {
      ctx.fillStyle = '#6ee7b7'; // soft green
    }

    // Rounded top bar
    const radius = 4;
    ctx.beginPath();
    if (barH > radius) {
      ctx.moveTo(barX, paddingTop + chartHeight);
      ctx.lineTo(barX, barY + radius);
      ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
      ctx.lineTo(barX + barWidth - radius, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + radius);
      ctx.lineTo(barX + barWidth, paddingTop + chartHeight);
    } else if (barH > 0) {
      ctx.rect(barX, barY, barWidth, barH);
    }
    ctx.closePath();
    ctx.fill();

    // Active day indicator outline
    if (day.isCurrent) {
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Calorie label above bar
    if (day.calories > 0) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day.calories.toString(), xCenter, Math.max(barY - 5, 12));
    }

    // Day Label (X Axis)
    ctx.fillStyle = day.isCurrent ? '#0f172a' : '#64748b';
    ctx.font = day.isCurrent ? 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(day.label, xCenter, paddingTop + chartHeight + 15);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(day.shortDate, xCenter, paddingTop + chartHeight + 27);
  });
}

// Window resize listener to re-render responsive chart
window.addEventListener('resize', () => {
  renderWeeklyChart();
});

// ============================================================================
// Modal Handlers (Add Food & Goals)
// ============================================================================
function openAddFoodModal(category = 'breakfast') {
  dom.modalTitle.textContent = 'Log Food Item';
  dom.foodForm.reset();
  dom.editEntryId.value = '';
  dom.mealCategory.value = category;
  dom.presetTargetMeal.value = category;

  // Set default tab to Custom
  activateModalTab('customTab');
  populatePresets();

  dom.addFoodModal.classList.add('active');
  setTimeout(() => dom.foodName.focus(), 50);
}

function openEditFoodModal(foodId) {
  const result = state.getFoodById(state.currentDate, foodId);
  if (!result) return;
  const { item, category } = result;

  dom.modalTitle.textContent = 'Edit Food Item';
  dom.editEntryId.value = item.id;
  dom.foodName.value = item.name;
  dom.mealCategory.value = category;
  dom.foodServing.value = item.serving || '';
  dom.foodCalories.value = item.calories;
  dom.foodProtein.value = item.protein || 0;
  dom.foodCarbs.value = item.carbs || 0;
  dom.foodFat.value = item.fat || 0;

  activateModalTab('customTab');
  dom.addFoodModal.classList.add('active');
}

function closeAddFoodModal() {
  dom.addFoodModal.classList.remove('active');
}

function activateModalTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

function populatePresets(searchTerm = '') {
  const term = searchTerm.toLowerCase().trim();
  const filtered = FOOD_PRESETS.filter(p => p.name.toLowerCase().includes(term));

  if (filtered.length === 0) {
    dom.presetListContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: #94a3b8; font-size: 0.85rem;">No matching food found</div>';
    return;
  }

  dom.presetListContainer.innerHTML = '';
  filtered.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `
      <div class="preset-info">
        <span class="preset-name">${escapeHTML(preset.name)}</span>
        <span class="preset-meta">${preset.serving} &bull; P:${preset.protein}g C:${preset.carbs}g F:${preset.fat}g</span>
      </div>
      <div>
        <span class="preset-cal">${preset.calories} kcal</span>
        <button type="button" class="btn btn-primary btn-sm preset-add-btn">+ Add</button>
      </div>
    `;

    item.querySelector('.preset-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const targetMeal = dom.presetTargetMeal.value;
      state.addFood(state.currentDate, targetMeal, {
        name: preset.name,
        serving: preset.serving,
        calories: preset.calories,
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat
      });
      closeAddFoodModal();
      renderDayOverview();
      renderMealLists();
      renderWeeklyChart();
      showToast(`Added ${preset.name} to ${targetMeal}!`, 'success');
    });

    dom.presetListContainer.appendChild(item);
  });
}

function openGoalsModal() {
  dom.targetCaloriesInput.value = state.goals.calories;
  dom.targetProteinInput.value = state.goals.protein;
  dom.targetCarbsInput.value = state.goals.carbs;
  dom.targetFatInput.value = state.goals.fat;
  dom.targetWaterInput.value = state.goals.water;
  dom.goalsModal.classList.add('active');
}

function closeGoalsModal() {
  dom.goalsModal.classList.remove('active');
}

// ============================================================================
// Event Listeners Setup
// ============================================================================
function setupEventListeners() {
  // Date navigation
  dom.datePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      state.currentDate = e.target.value;
      renderAll();
    }
  });

  dom.prevDateBtn.addEventListener('click', () => changeDateByOffset(-1));
  dom.nextDateBtn.addEventListener('click', () => changeDateByOffset(1));
  dom.todayBtn.addEventListener('click', () => {
    state.currentDate = state.getLocalDateString(new Date());
    renderAll();
  });

  // Hydration buttons
  dom.addWaterBtn.addEventListener('click', () => {
    state.updateWater(state.currentDate, 250);
    renderDayOverview();
    showToast('+250 ml logged', 'info');
  });

  dom.addWaterBigBtn.addEventListener('click', () => {
    state.updateWater(state.currentDate, 500);
    renderDayOverview();
    showToast('+500 ml logged', 'info');
  });

  dom.subWaterBtn.addEventListener('click', () => {
    state.updateWater(state.currentDate, -250);
    renderDayOverview();
  });

  dom.resetWaterBtn.addEventListener('click', () => {
    state.resetWater(state.currentDate);
    renderDayOverview();
    showToast('Water reset for today', 'info');
  });

  // Open Add Food modal buttons
  dom.quickAddGlobalBtn.addEventListener('click', () => openAddFoodModal('breakfast'));

  document.querySelectorAll('.add-meal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openAddFoodModal(btn.dataset.meal);
    });
  });

  dom.closeFoodModalBtn.addEventListener('click', closeAddFoodModal);
  dom.cancelFoodBtn.addEventListener('click', closeAddFoodModal);

  // Modal Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activateModalTab(btn.dataset.tab));
  });

  // Preset search
  dom.presetSearchInput.addEventListener('input', (e) => {
    populatePresets(e.target.value);
  });

  // Food Form submit
  dom.foodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const foodItem = {
      name: dom.foodName.value.trim(),
      serving: dom.foodServing.value.trim(),
      calories: Math.max(0, parseFloat(dom.foodCalories.value) || 0),
      protein: Math.max(0, parseFloat(dom.foodProtein.value) || 0),
      carbs: Math.max(0, parseFloat(dom.foodCarbs.value) || 0),
      fat: Math.max(0, parseFloat(dom.foodFat.value) || 0)
    };
    const category = dom.mealCategory.value;
    const editId = dom.editEntryId.value;

    if (editId) {
      state.updateFood(state.currentDate, category, editId, foodItem);
      showToast(`Updated "${foodItem.name}"`, 'success');
    } else {
      state.addFood(state.currentDate, category, foodItem);
      showToast(`Logged "${foodItem.name}" to ${category}!`, 'success');
    }

    closeAddFoodModal();
    renderDayOverview();
    renderMealLists();
    renderWeeklyChart();
  });

  // Goals Modal
  dom.openGoalsBtn.addEventListener('click', openGoalsModal);
  dom.closeGoalsModalBtn.addEventListener('click', closeGoalsModal);
  dom.cancelGoalsBtn.addEventListener('click', closeGoalsModal);

  dom.goalsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.saveGoals({
      calories: parseInt(dom.targetCaloriesInput.value, 10) || 2000,
      protein: parseFloat(dom.targetProteinInput.value) || 140,
      carbs: parseFloat(dom.targetCarbsInput.value) || 220,
      fat: parseFloat(dom.targetFatInput.value) || 65,
      water: parseInt(dom.targetWaterInput.value, 10) || 2500
    });
    closeGoalsModal();
    renderAll();
    showToast('Daily targets saved!', 'success');
  });

  // Close modals on clicking outside backdrop
  window.addEventListener('click', (e) => {
    if (e.target === dom.addFoodModal) closeAddFoodModal();
    if (e.target === dom.goalsModal) closeGoalsModal();
  });

  // Export Data JSON
  dom.exportDataBtn.addEventListener('click', () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      goals: state.goals,
      logs: state.logs
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutritrack_backup_${state.currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  });

  // Import Data JSON
  dom.importDataInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.goals && parsed.logs) {
          state.saveGoals(parsed.goals);
          state.logs = parsed.logs;
          state.saveLogs();
          renderAll();
          showToast('Data imported successfully!', 'success');
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch (err) {
        console.error('Import failed', err);
        showToast('Error parsing JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  });

  // Clear All Data
  dom.clearAllBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear all your tracked data and targets? This cannot be undone.');
    if (confirmed) {
      localStorage.removeItem('nutritrack_logs');
      localStorage.removeItem('nutritrack_goals');
      state.goals = { ...DEFAULT_GOALS };
      state.logs = {};
      renderAll();
      showToast('All local data cleared.', 'info');
    }
  });
}

// ============================================================================
// Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderAll();
});

