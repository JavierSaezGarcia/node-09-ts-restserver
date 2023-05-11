import { Request, Response } from "express";
import Usuario from "../models/usuario";


export const getUsuarios = async(req: Request, res: Response) => {
    // Restringimos para que muestre solo los que tienen estado en true
    const usuarios = await Usuario.findAll({
        where:{
            estado: true
        }
    });
    // En caso de que queramos listar todos
    // const usuarios = await Usuario.findAll();

    res.json({usuarios});
}

export const getUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if(!usuario){
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }else{
        res.json({ usuario });
    }
}   

export const postUsuario = async(req: Request, res: Response) => {
    const { body } = req;
    
    
    
    try {
        const existeEmail = await Usuario.findOne({
            where: {
                email: body.email
            }
            
        });
        if(existeEmail){
            return res.status(400).json({
                msg: 'Ya existe un usuario con el email' + body.email
            });
        }   
        const usuario = await Usuario.create(body);
        res.json(usuario);
        
    } catch (error) {
       res.status(500).json({
           msg: 'Hable con el administrador'
            
       });
    }
        
    
    
}

export const putUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    try {

        const usuario = await Usuario.findByPk(id);
        if(!usuario){   
            
            return res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        } else{
            const existeEmail = await Usuario.findOne({
                where: {
                    email: body.email
                }
                
            });
            if(existeEmail){
                return res.status(400).json({
                    msg: 'Ya existe un usuario con el email ' + body.email
                });
            }


            await usuario.update(body);
            res.json(usuario);

        }         
        
    } catch (error) {
       res.status(500).json({
           msg: 'Hable con el administrador'
            
       });
    }
}

export const deleteUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if(!usuario){         
        return res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }

    // TODO eliminación física ( no aconsejada ya que pueden dar errores referenciales )
    // await usuario.destroy();
    // res.json({
    //     msg: 'Usuario eliminado',
    //     usuario
    // });


    // TODO eliminación lógica
    await usuario.update({estado: false});
    res.json({
        msg: 'Usuario eliminado',
        usuario        
    });
}





