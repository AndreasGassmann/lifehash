import * as tape from 'tape';

import { Point } from '../ts_src/lifehash/Point';
import { BitAggregator } from '../ts_src/lifehash/BitAggregator';
import { Size } from '../ts_src/lifehash/Size';
import { Grid } from '../ts_src/lifehash/Grid';
import { Color } from '../ts_src/lifehash/Color';

// Point.zero = new Point(0, 0);

tape('Create BitAggregator', (t) => {
  let aggregator: any = new BitAggregator();

  t.deepEqual(aggregator._data, []);
  t.equal(aggregator.bitMask, 0);

  aggregator.append(false);
  t.deepEqual(aggregator._data, [0]);
  t.equal(aggregator.bitMask, 64);

  aggregator.append(true);
  t.deepEqual(aggregator._data, [64]);
  t.equal(aggregator.bitMask, 32);

  t.equal(aggregator.get_data().toString(), '64');

  t.end();
});

// tape('Create BitEnumerator class', (t) => {
//   let bitEnumerator = new BitEnumerator();

//   t.end();
// });

tape('Create Size class', (t) => {
  let size = new Size(50, 60);
  t.equal(size.width, 50);
  t.equal(size.height, 60);

  t.end();
});

tape('Create  Point class', (t) => {
  let point = new Point(5, 6);
  t.equal(point.x, 5);
  t.equal(point.y, 6);

  t.end();
});

tape('Compare Points', (t) => {
  let p1 = new Point(5, 6),
    p2 = new Point(5, 6),
    p3 = new Point(5, 7);

  t.equal(p1.equals(p2), true);
  t.equal(p2.equals(p1), true);
  t.equal(p1.equals(p3), false);
  t.equal(p2.equals(p3), false);
  t.equal(p3.equals(p1), false);
  t.equal(p3.equals(p2), false);

  t.end();
});

tape('Create Grid class', (t) => {
  const size = new Size(4, 3);
  const grid: any = new Grid(size);

  t.equal(grid.size, size);
  t.equal(grid._capacity, size.width * size.height);

  t.deepEqual(grid._storage, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  t.equal(grid._maxX, size.width - 1);
  t.equal(grid._maxY, size.height - 1);
  let points = grid.get_points();
  t.equal(points.next().value.equals(new Point(0, 0)), true);
  t.equal(grid._offset(points.next().value), 1);
  t.equal(grid.get_value(points.next().value), 0);

  grid.set_value(1, points.next().value);

  t.deepEqual(grid._storage, [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);

  let neighbors = grid.get_neighborhood(new Point(1, 1));
  t.equal(neighbors.next().value[1].equals(new Point(0, 0)), true);
  t.equal(neighbors.next().value[1].equals(new Point(1, 0)), true);

  t.deepEqual(grid.colors().slice(0, 12), [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);

  t.end();
});

tape('Create  Color class', (t) => {
  let color = Color.from_uint8_values(0, 255, 128);

  t.deepEqual([color.r, color.g, color.b], [0, 255 / 255, 128 / 255]);

  t.end();
});

// tape('Create CellGrid class', (t) => {
//   let size = new Size(4, 4),
//     cellGrid = new CellGrid(size);
//   let points = cellGrid.get_points();
//   cellGrid.set_value(true, points.next().value);
//   cellGrid.set_value(true, new Point(3, 2));

//   t.equal(cellGrid.count_neighbors(points.next().value), 1);
//   t.equal(cellGrid.count_neighbors(points.next().value), 0);
//   t.equal(cellGrid.count_neighbors(points.next().value), 1);
//   t.equal(cellGrid.count_neighbors(points.next().value), 2);
//   t.equal(cellGrid.count_neighbors(points.next().value), 1);
//   t.equal(cellGrid.count_neighbors(points.next().value), 1);

//   t.equal(
//     CellGrid.is_alive_in_next_generation(
//       false,
//       cellGrid.count_neighbors(points.next().value),
//     ),
//     false,
//   );
//   t.equal(
//     CellGrid.is_alive_in_next_generation(
//       false,
//       cellGrid.count_neighbors(points.next().value),
//     ),
//     false,
//   );
//   t.equal(
//     CellGrid.is_alive_in_next_generation(
//       false,
//       cellGrid.count_neighbors(points.next().value),
//     ),
//     false,
//   );
//   let digest = createHash('sha256').update('Hello').digest();
//   let hashCellGrid: any = new CellGrid(new Size(16, 16));
//   hashCellGrid.set_data(digest);

//   t.deepEqual(hashCellGrid._storage.slice(0, 6), [
//     false,
//     false,
//     false,
//     true,
//     true,
//     false,
//   ]);

//   t.end();
// });

// tape('Create ColorGrid class', (t) => {
//   let size = new Size(16, 16),
//     cellGrid = new CellGrid(size);

//   t.end();
// });

// tape('Create LifeHash class', (t) => {
//   let image = LifeHash.makeFrom('Hello');
//   t.equal(image.width, 32);
//   t.equal(image.height, 32);
//   t.equal(image.colors.length, 1024 * 3);
//   let expected = [
//     146, 126, 130, 178, 104, 92, 182, 101, 87, 202, 88, 64, 199, 89, 66, 197,
//     90, 69, 182, 101, 87, 180, 102, 89, 159, 117, 114, 210, 82, 54,
//   ];
//   t.deepEqual(image.colors.slice(0, 30), expected);
//   t.end();
// });

// tape('Create LifeHash with alpha', (t) => {
//   let image = LifeHash.makeFrom('Hello', LifeHashVersion.version2, 1, true);
//   t.equal(image.width, 32);
//   t.equal(image.height, 32);
//   t.equal(image.colors.length, 1024 * 4);
//   let expected = [
//     146, 126, 130, 255, 178, 104, 92, 255, 182, 101, 87, 255, 202, 88, 64, 255,
//     199, 89, 66, 255, 197, 90, 69, 255, 182, 101, 87, 255, 180, 102, 89, 255,
//     159, 117, 114, 255, 210, 82, 54, 255,
//   ];

//   t.deepEqual(image.colors.slice(0, 40), expected);
//   t.end();
// });
