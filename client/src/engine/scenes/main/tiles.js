const rock = 'R';
const path = ' ';
const wall = '#';

export default function(current, [top, right, bottom, left]) {
  switch (current) {
    case path:
      return 0;
    case rock:
      return 3;
    case wall:
      if (bottom === path) {
        if (left === path && right === path) return 14;
        else if (left === path) return 12;
        else if (right === path) return 13;
        return 11;
      }

      if (top === path && right === path && left === path) return 10;
      else if (top === path && right === path) return 9;
      else if (top === path && left === path) return 8;
      else if (top === path) return 6;
      else if (right === path && left === path) return 7;
      else if (right === path) return 5;
      else if (left === path) return 4;

      return 3;
    default:
      return -1;
  }
};
