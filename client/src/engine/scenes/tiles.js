const px = 64;

const spawn = '*';
const rock = 'undefined';
const path = ' ';
const wall = '#';

// chunk = [
//          #,
//   ['*', '*', '*'],
//          #,
// ];
export default (chunk) => {
  const tile = chunk[1][1];
  const top = chunk[1];
  const left = chunk[1][0];
  const right = chunk[1][2];
  const bottom = chunk[2];

  switch (tile) {
    case rock:
      return 3 * px;
    case path:
      // if (left === wall && right === wall) return 2 * px;
      // else return px;
      return px;
    case wall:
      if (bottom === path) {
        if (left === path && right === path) return 14 * px;
        else if (left === path) return 12 * px;
        else if (right === path) return 13 * px;
        else return 11 * px;
      } else {
        if (top === path && right === path && left === path) return 10 * px;
        else if (top === path && right === path) return 9 * px;
        else if (top === path && left === path) return 8 * px;
        else if (top === path) return 6 * px;
        else if (right === path && left === path) return 7 * px;
        else if (right === path) return 5 * px;
        else if (left === path) return 4 * px;
      }
      return 3 * px;
    default:
      break;
  }
}
