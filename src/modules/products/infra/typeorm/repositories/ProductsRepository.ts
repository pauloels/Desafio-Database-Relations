import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const productsRepository = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(productsRepository);

    return productsRepository;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProducts = await this.ormRepository.findOne({
      where: { name },
    });

    return findProducts;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findAllProductsById = await this.ormRepository.find({
      where: { products },
    });

    return findAllProductsById;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsId = products.map(product => ({ id: product.id }));

    const foundProduct = await this.findAllById(productsId);

    /** percorre o findproduct q é um product
    const updatedProduct = findProduct.map(product => ({
      ...product, // ele copia todas as info do product ex: id price quantity
      // mas muda o item quantity
      quantity:
        // ele seta um valor pegando a quantity do findProduct que é o map product.quantity q vem do ormRepository - a quantity do products q é [id, quantity] que vem do product insomnia
        product.quantity -
        (products.find(({ id }) => id === product.id)?.quantity || 0),
      // precisa confirmar se o id so products = id do findProduct que é o map product.id se for ? ele pega a quantity || 0
      // ele só subtrai ex: tenho 3 no product e tenho 2 no products vai setar no bd 1
    }));
*/

    const updatedProducts = foundProduct.map(product => ({
      ...product,
      quantity:
        product.quantity -
        (products.find(prod => prod.id === product.id)?.quantity || 0),
    }));

    await this.ormRepository.save(updatedProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
