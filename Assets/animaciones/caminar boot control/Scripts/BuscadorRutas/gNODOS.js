#pragma strict

var TagNodos : String = "Finish";

private var Nodos : GameObject[];
private var hit : RaycastHit;

private var nNodos : int=0;
private var nConexiones : int=0;
private var Posicion : Vector3[]; //Posicion de cada nodo
private var Conexion : int[]; //Primera conexion de cada nodo. Para agilizar la busqueda de conexiones de cada nodo.
private var Tramo : float[]; //Especificacion de cada conexion


function CrearListadoNodos() {

	var i:int=0; //Contador nodo actual
	var w:int=0; //Contador numero conexiones
	var q:int=0; //Contador nodo seleccionado
	
	for each ( var nodoActual:GameObject in Nodos) nNodos++;
	
	Posicion = new Vector3[nNodos];
	Conexion = new int[nNodos];
	
	//Contabilizar el numero de conexiones. Cada tramo de conexion necesita 3 datos:
	// 0 - Nodo al que pertenece la conexion
	// 1 - Nodo que se encuentra conectado
	// 2 - Distancia entre ambos nodos
	for each ( var nodoActual:GameObject in Nodos) {
	
		for each ( var nodoSeleccionado:GameObject in Nodos) {
		
			if (nodoActual != nodoSeleccionado) {
			
				if (Physics.Linecast( nodoActual.transform.position , nodoSeleccionado.transform.position , hit)) {
				
					if (hit.transform.gameObject == nodoSeleccionado) {

						w += 3;
						
					}
				
				}			
			
			}
			
		}
		
	}
	
	nConexiones = w;
	Tramo = new float[nConexiones]; //Asignamos espacio requerido a matriz Tramo
	w = 0; //Reiniciar a 0 w, para crear conexiones
	
	for each ( var nodoActual:GameObject in Nodos) {
	
		Posicion[i] = nodoActual.transform.position;
		Conexion[i] = w;
		
		q = 0;
		
		for each ( var nodoSeleccionado:GameObject in Nodos) {
		
			if (nodoActual != nodoSeleccionado) {
			
				if (Physics.Linecast( nodoActual.transform.position , nodoSeleccionado.transform.position , hit)) {
				
					if (hit.transform.gameObject == nodoSeleccionado) {
					
						Tramo[w] = i; //Nodo al que pertenece.
						Tramo[w+1] = q; //Nodo conectado
						Tramo[w+2] = Vector3.Distance(nodoActual.transform.position,nodoSeleccionado.transform.position);
						
						w += 3;
						
					}
				
				}			
			
			}
			
			q++;
		
		}
		
		i++;

	}
	
}

function DestruirNodos() {

	for each ( var nodoActual:GameObject in Nodos) {
	
		Destroy(nodoActual);
	
	}	
	
}

function Awake() {
	
	Nodos = GameObject.FindGameObjectsWithTag( TagNodos );
	
	if (Nodos != null) CrearListadoNodos();
		
}

function Start() {

	if (Nodos != null) DestruirNodos();
}

function GetnNodos() : int { //El termino ingles Get, significa coger. Cogemos y pasamos el valor de una variable privada.

	return nNodos;

}

function GetnConexiones() : int { //El termino ingles Get, significa coger. Cogemos y pasamos el valor de una variable privada.

	return nConexiones;

}

function GetConexion() : int[] {

	return Conexion;

}

function GetPosicion() : Vector3[] {

	return Posicion;

}

function GetTramo() : float[] {

	return Tramo;

}