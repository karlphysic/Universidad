import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Llaves } from '../config/Llaves';
import { Persona } from '../models';
import { PersonaRepository } from '../repositories';

const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({ scope: BindingScope.TRANSIENT })
export class AutenticacionService {
  constructor(

    @repository(PersonaRepository)
    public personaRepository: PersonaRepository

  ) { }

  GenerarClave() {
    let clave = generador(10, false);
    return clave;
  }


  cifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;

  }

  IdentificarPersona(usuario: string, clave: string) {
    try {
      let p = this.personaRepository.findOne({ where: { correo: usuario, clave: clave } })
      if (p) {
        return p;
      }

    } catch (error) {
      return false;
    }

  }

  GenerarTokenJWT(persona: Persona) {
    let token = jwt.sign({
      data: {
        id: persona.id,
        correo: persona.correo,
        nombre: persona.nombres + " " +
          persona.apellidos
      }
    },
      Llaves.claveJWT
    )
    return token;

  }
  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
