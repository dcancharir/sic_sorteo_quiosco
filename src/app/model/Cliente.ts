import { TipoDocumento } from './TipoDocumento';

export interface Cliente {
  ClienteId: number;
  NroDoc: string;
  Nombre: string;
  NombreCompleto: string;
  ApelPat: string;
  ApelMat: string;
  Genero: string;
  Celular: string;
  // Celular2: string;
  Mail: string;
  FechaNacimiento: Date;
  TipoDocumentoId: number;
  UbigeoId: number;
  Estado: number;
  TipoRegistro: string;
  estado_string: string;
  clase: string;
  CodigoImpresion: string;
  Prohibido: number;
  prohibido_string: string;
  prohibido_clase: string;
  TipoDocumento: TipoDocumento;
  TipoImpresion: boolean;
}

export interface ClienteUpdateTipoImpresion {
  ClienteId: number;
  TipoImpresion: boolean;
}
