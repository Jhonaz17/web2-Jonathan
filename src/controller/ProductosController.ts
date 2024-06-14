import { Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Productos } from "../entity/Productos";
import { report } from "process";

class ProductosController{


    static getAll= async(req:Request, resp:Response)=>{
        

        try {
            //instancia de bd
            const repo= AppDataSource.getRepository(Productos);
            //consulta de base de datos por medoto find
            const listaProductos= await repo.find();

            //valido si trajo datos, sino devuelvo error 
            if (listaProductos.length==0){
                return resp.status(404).json({message: "No hay datos registrados"})
            }
            //retorno los datos encontrados
            return resp.status(200).json(listaProductos)

        } catch (error) {
            return resp.status(400).json({message: "Error al acceder a la base de datos"})
        }

        
    }

    static create= async(req:Request, resp:Response)=>{
        
        const repoProducto = AppDataSource.getTreeRepository(Productos);

        try {
            
            //destructuracion
            const {id, nombre, precio, stock, categoria}= req.body;

            //validar datos 
            if(!id){
                return resp.status(400).json({message: "De indicar un id del producto."})
            }
            if(!nombre){
                return resp.status(400).json({message: "De indicar el nombre del producto."})
            }
            if(!precio){
                return resp.status(400).json({message: "De indicar el precio del producto."})
            }
            if(!stock){
                return resp.status(400).json({message: "De indicar el stock del producto."})
            }
            if(!categoria){
                return resp.status(400).json({message: "De indicar la categoria del producto."})
            }

            //reglas de negocio

            //validar si el producto ya existe
            
                let product= await repoProducto.findOne({where:{id}});
                if(product){
                    return resp.status(400).json({message: "Ese producto ya existe"})
                }
            //validar la cantidad de stock ingresada     
                if(stock<=0){
                    return resp.status(400).json({message: "El stock debe ser mayor a cero"})
                }

                
                product = new Productos; 

                product.id= id;
                product.nombre= nombre;
                product.precio= precio;
                product.stock= stock;
                product.categoria= categoria;
                product.estado= true;

                await repoProducto.save(product);

        } catch (error) {
            return resp.status(400).json({message: "Error al guardar."})

        }
        return resp.status(200).json("Producto guardado correctamente.")
    }

    static getOne= async(req:Request, resp:Response)=>{

        try {
            const id= parseInt(req.params['id']);

            //validacion de mas 
            if(!id){
                return resp.status(400).json({message: "Debe indicar el ID"})
            }
            const repo= AppDataSource.getTreeRepository(Productos);

            try {

                const producto = await repo.findOneOrFail({ where: { id } });
                return resp.status(200).json(producto);
            } catch (error) {
                return resp.status(404).json({message: "El producto con el ID indicado no existe"});
            }

        } catch (error) {
            
        }

    }
    
    static update = async (req: Request, resp: Response) => {
        const id = parseInt(req.params['id']);
        const { nombre, precio, stock, categoria } = req.body;

        if (!id) {
            return resp.status(400).json({ message: "Debe indicar el ID del producto" });
        }

        const repo = AppDataSource.getRepository(Productos);

        try {
            const producto = await repo.findOne({ where: { id } });

            if (!producto) {
                return resp.status(404).json({ message: "El producto con el ID indicado no existe" });
            }

            if (nombre) producto.nombre = nombre;
            if (precio) producto.precio = precio;
            if (stock) producto.stock = stock;
            if (categoria) producto.categoria = categoria;

            await repo.save(producto);

            return resp.status(200).json({ message: "Producto actualizado correctamente" });
        } catch (error) {
            return resp.status(400).json({ message: "Error al actualizar el producto" });
        }
    }

    static delete = async (req: Request, resp: Response) => {
        const id = parseInt(req.params['id']);

        if (!id) {
            return resp.status(400).json({ message: "Debe indicar el ID del producto" });
        }

        const repo = AppDataSource.getRepository(Productos);

        try {
            const producto = await repo.findOne({ where: { id } });

            if (!producto) {
                return resp.status(404).json({ message: "El producto con el ID indicado no existe" });
            }

            await repo.remove(producto);

            return resp.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            return resp.status(400).json({ message: "Error al eliminar el producto" });
        }
    }

}

export default ProductosController;