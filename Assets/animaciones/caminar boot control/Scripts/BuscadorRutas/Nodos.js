#pragma strict

var GrupoNodos : Transform;
var TagPlayer : String = "Player";
var Margen : float = 0.35;

private var gNodos : gNODOS;

private var oldDestino : Vector3;
private var dir : Vector3;
private var Objetivo : Vector3;

private var hit : RaycastHit;

private var nNodos : int = 0;
private var nConexiones : int;

private var TipoNodo : int[];
private var Conexion : int[];

private var Distancia : float[];
private var Tramo : float[];

private var Posicion : Vector3[];

private var oldDistanciaObjetivo : float = 0;
private var Temp : float;

function Start() {

	if (GrupoNodos != null) {
	
		gNodos = GrupoNodos.GetComponent(gNODOS);
	
		nNodos = gNodos.GetnNodos();
		nConexiones = gNodos.GetnConexiones();
	
		TipoNodo = new int[nNodos];
	
		Distancia = new float[nNodos];
	
		Conexion = gNodos.GetConexion();
		Posicion = gNodos.GetPosicion();
		Tramo = gNodos.GetTramo();
		
	}

}


function direccion ( origen : Vector3, destino : Vector3 ) : Vector3 {
	
	if (nNodos == 0) return Vector3.zero; //Si no existen nodos o se encuentra cerca al destino, no mover.		
			
	
	if (oldDestino == destino) {
	
		Temp = Vector3.Distance(origen,Objetivo);
	
		if ( Temp <= oldDistanciaObjetivo) {
		
			oldDistanciaObjetivo = Temp;
			return dir; //Si todavia no hemos llegado al nodo seleccionado anterior
			
		}
	
	}
	
	var i : int;
	var w : int;
	var q : int;
	var z : float;
	

	if (Physics.Linecast( destino , origen , hit )) {
	
		if (hit.transform.tag == TagPlayer) { //Si el player visualiza el destino
			
			dir = destino - origen;
			dir.Normalize();
			oldDestino = destino;
			Objetivo = destino;
			oldDistanciaObjetivo = Vector3.Distance(origen,Objetivo);			
			return dir;
		
		}
	
	}	
	
	
	//TIPO NODO:
	//
	//0-Nodo Intermedio
	//1-Nodo visible por el objetivo
	//2-Nodo visible por el player
	//3-Nodo visible por el objetivo y el player
	//4-Nodo muy cercano al player
	
	for (i=0; i<nNodos; i++) {
	
		if (!Physics.Linecast(destino,Posicion[i],hit)) {
		
			TipoNodo[i] = 1; //Nodo visible por el objetivo
			Distancia[i] = Vector3.Distance(destino,Posicion[i]);
		
		} else {
		
			TipoNodo[i]=0; //Nodo intermedio
			Distancia[i]=Mathf.Infinity;
			
		}
		
		if (!Physics.Linecast(origen,Posicion[i],hit)) {
		
			if (TipoNodo[i] == 1) TipoNodo[i]=3; else TipoNodo[i]=2; //Si es visible por el player y el destino es tipo 3, y tipo 2 cuando es visible solo por el player
		
		}		
		
		if (Vector3.Distance(origen,Posicion[i]) < Margen ) TipoNodo[i]=4; //Nodo demasiado cercano al player		
		
	}
	
	var t : int=0;
	var oldt : int=0;
	
	//Calculamos las distancias mientras exista algun nodo tipo 0	
	do {		
		
		for (i=0; i<nNodos; i++) {			
		
			if (TipoNodo[i] == 0) {
			
				t++; //Contar numero de nodos tipo 0
			
				//Mirar si existe alguna conexion tipo 1
				
				q=0; //Indice Tramo
				
				//Las conexiones se encuentran en la matriz unidimensional Tramo, en grupos de 3:
				// 0 - Nodo al que pertenece la conexion
				// 1 - Nodo al que se encuentra conectado
				// 2 - Distancia entre nodos
				
				//Para acelerar la busqueda, he guardado la posicion dentro de la matriz Tramo de la primera conexion
				//de cada nodo en Conexion[]. A continuacion, hace un salto de 3 elementos y pasa a la
				//siguiente conexion, comprobando que la conexion pertenece al nodo seleccionado actualmente.
								
				while (Tramo[ q*3 + Conexion[i]] == i) {//Mientras el Tramo sea del nodo actual
				
					if  (TipoNodo[Tramo[q*3+Conexion[i]+1]] == 1) { //TipoNodo del nodo conectado igual a 1
					
						TipoNodo[i] = 1; //Cambiamos a tipo 1, para no volver a actualizar
					
						z = Tramo[q*3+Conexion[i]+2]; //Distancia al nodo conectado
						
						z += Distancia [Tramo[ q*3 + Conexion[i] + 1]]; //+ Distancia del nodo conectado
						
						if (z < Distancia[i]) Distancia[i] = z; //Si la distancia es menor a la distancia actual, actualizamos distancia
					
					}
					
					q++;
					if(q*3 + Conexion[i] > nConexiones-3) break; //Evitar sobrepasar el indice
				
				} 
			
			}
				
		}
		
		w=0;
				
		for (i=0; i<nNodos; i++) {
		
			if (TipoNodo[i] == 0) w++;
			
		}			
		
		if (t == oldt) break; else oldt = t; //Algunos nodos se quedan encajonados, siempre a tipo 0.
		
		t=0;
		
	} while (w>0);
	
	
		
	//Actualizamos nodos finales tipo 2: Cercano al Player, y tipo 3:Visibles por el player y el objetivo
	for (i=0; i<nNodos; i++) {
		
		if (TipoNodo[i] == 2) {
		
			q=0; //Indice Tramo
				
			while (Tramo[ q*3 + Conexion[i]] == i) {//Mientras el Tramo sea del nodo actual	
			
				if  (TipoNodo[Tramo[ q*3 + Conexion[i] + 1]] == 1) { //TipoNodo del nodo conectado igual a 1
				
					z = Tramo[ q*3 + Conexion[i] + 2]; //Distancia al nodo conectado
						
					z += Distancia [Tramo[ q*3 + Conexion[i] + 1]]; //+ Distancia del nodo conectado
					
					if (z < Distancia[i]) Distancia[i] = z; //Si la distancia es menor a la distancia actual, actualizamos distancia
									
				}
				
				q++;
				
				if(q*3 + Conexion[i] > nConexiones-3) break; //Evitar sobrepasar el indice
			
			}
			
			//Incrementamos la distancia al player
			Distancia[i] += Vector3.Distance(Posicion[i],origen);
		
		} else if (TipoNodo[i] == 3) {
		
			//Incrementamos la distancia al player
			Distancia[i] += Vector3.Distance(Posicion[i],origen);		
		
		}
			
	}	
	
	//Seleccionamos la menor distancia entre los nodos tipo 2 y 3
	z = Mathf.Infinity;
	w = 0;
	
	for (i=0; i<nNodos; i++) {
	
		if ((TipoNodo[i] == 2) || (TipoNodo[i] == 3)) {
		
			if (Distancia[i] < z) {
				
				z = Distancia[i];
				w = i;
				
			}
		
		}
	
	}
	
	oldDestino = destino;
	Objetivo = Posicion[w];
	dir = Posicion[w]-origen;
	dir.Normalize();
	oldDistanciaObjetivo = Vector3.Distance(origen,Objetivo);
	return dir;
	
}

