export const checklists = {
  preflight: [
    'Battery',
    'Fuel Pumps',
    'Beacon',
    'Flight Controls'
  ],
  landing: [
    'Gear Down',
    'Flaps Set',
    'Autobrake',
    'Spoilers Armed'
  ]
};

export function checklistComplete(items: string[], completed: string[]) {
  return items.every(item => completed.includes(item));
}
