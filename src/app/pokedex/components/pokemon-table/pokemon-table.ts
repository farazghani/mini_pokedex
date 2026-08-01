import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

import {
  MatSort,
  MatSortModule,
  Sort,
} from '@angular/material/sort';

import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-table',

  standalone: true,

  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './pokemon-table.component.html',

  styleUrl: './pokemon-table.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonTableComponent implements AfterViewInit {

  readonly pokemon =
    input.required<Pokemon[]>();

  readonly loading =
    input(false);

  readonly error =
    input<string | null>(null);

  readonly rowClicked =
    output<number>();

  readonly sortChanged =
    output<Sort>();

  readonly pageChanged =
    output<PageEvent>();

  readonly displayedColumns = [
    'sprite',
    'name',
    'types',
    'hp',
    'attack',
    'defense',
    'spAttack',
    'spDefense',
    'speed',
    'total',
  ];

  readonly dataSource =
    new MatTableDataSource<Pokemon>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;
  }

  clickRow(
    pokemon: Pokemon,
  ): void {
    this.rowClicked.emit(
      pokemon.id,
    );
  }

  onSortChange(
    sort: Sort,
  ): void {
    this.sortChanged.emit(sort);
  }

  onPageChange(
    event: PageEvent,
  ): void {
    this.pageChanged.emit(event);
  }

  getStat(
    pokemon: Pokemon,
    stat: string,
  ): number {
    return (
      pokemon.stats.find(
        (item) => item.name === stat,
      )?.baseStat ?? 0
    );
  }

  getTotal(
    pokemon: Pokemon,
  ): number {
    return pokemon.stats.reduce(
      (sum, stat) =>
        sum + stat.baseStat,
      0,
    );
  }

  trackByPokemon(
    index: number,
    pokemon: Pokemon,
  ): number {
    return pokemon.id;
  }
}