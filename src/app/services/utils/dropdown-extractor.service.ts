import { Injectable } from '@angular/core';
import { ApiProdukt } from '../../models/ApiProdukt';
import { ApiProduktPosition } from '../../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../../models/ApiProduktPositionBuchungspunkt';

export interface DropdownOptions {
  produktpositionOptions: ApiProduktPosition[];
  buchungspunktOptions: ApiProduktPositionBuchungspunkt[];
}

@Injectable({
  providedIn: 'root'
})
export class DropdownExtractorService {

  extractDropdownOptions(products: ApiProdukt[]): DropdownOptions {
    const positionsById = new Map<string, ApiProduktPosition>();
    const buchungspunkteById = new Map<string, ApiProduktPositionBuchungspunkt>();

    products.forEach(product => {
      product.produktPosition?.forEach(position => {
        if (position.id && !positionsById.has(position.id)) {
          positionsById.set(position.id, position);
        }

        position.produktPositionBuchungspunkt?.forEach(bp => {
          if (bp.id && !buchungspunkteById.has(bp.id)) {
            buchungspunkteById.set(bp.id, bp);
          }
        });
      });
    });

    return {
      produktpositionOptions: Array.from(positionsById.values()),
      buchungspunktOptions: Array.from(buchungspunkteById.values()),
    };
  }
}
