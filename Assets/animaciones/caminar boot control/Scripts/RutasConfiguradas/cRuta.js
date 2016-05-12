#pragma strict

private var Nodo : Vector3[];
private var nNodo : int;
private var Distancia : float[];
private var dRuta : float=0;
private var dBucle : float=0;



function Awake(){

	nNodo = transform.childCount;
	
	if (nNodo > 0) {
	
		Nodo = new Vector3[nNodo];
			
		for each ( var i:Transform in transform){
	
			Nodo[int.Parse(i.name)] = i.position;			
			Destroy(i.gameObject);
														
		}		
		
		if (nNodo > 1) {			
		
			var w : int;
			
			Distancia = new float[nNodo];
		
			for (w=0; w<nNodo; w++) {
		
				if ( w == nNodo-1) Distancia[w] = Vector3.Distance(Nodo[0],Nodo[w]);
					else Distancia[w]=Vector3.Distance(Nodo[w],Nodo[w+1]);
					
				dBucle += Distancia[w];
				
			}
			
			dRuta = dBucle - Distancia[nNodo-1];
			
		}
		
	}
	

}

function RutaBucle( dist : float) : Vector3 {

	var w:int;
	var d:float=0;
	var pos:Vector3;
	
	for (w=0; w<nNodo; w++) {
	
		d += Distancia[w];
	
		if (d >= dist) {
		
			d -= Distancia[w];
			d = dist - d;
			break;
			
		}
	
	}
	
	if (w == nNodo-1) pos = Nodo[0]-Nodo[w];
		else pos = Nodo[w+1]-Nodo[w];

	pos.Normalize();
	pos *= d;
	pos += Nodo[w];
	
	return pos;

}

function RutaPingPong (dist : float) : Vector3 {

	var w : int;
	var d : float = 0;
	var t : int = Mathf.FloorToInt(dist/dRuta);
	var distancia : float = dist % dRuta;
	var pos : Vector3;
	
	if (t%2 == 0) {
		
		for(w=0; w<nNodo-1; w++) {
		
			d += Distancia[w];
			
			if (d >= distancia) {
			
				d -= Distancia[w];
				d = distancia - d;
				break;
			
			}
		
		}
		
		pos = Nodo[w+1]-Nodo[w];	
	
	} else {
	
		for (w=nNodo-1; w>0; w--) {
		
			d += Distancia[w-1];
			
			if (d >= distancia) {
			
				d -= Distancia[w-1];
				d = distancia - d;
				break;
			
			}
		
		}
		
		pos = Nodo[w-1]-Nodo[w];
	
	}	
	
	pos.Normalize();
	pos *= d;
	pos += Nodo[w];
	
	return pos;

}

function RutaUnaVez (dist : float) : Vector3 {

	var w : int;
	var q : int=0;
	var d : float = 0;
	var pos : Vector3;	
	
	for (w=0; w<nNodo-1; w++) {
	
		d += Distancia[w];
		
		if (d >= dist) {
			
			d -= Distancia[w];
			d = dist - d;
			break;
		
		}
	
	}	
	
	pos = Nodo[w+1]-Nodo[w];	
	pos.Normalize();	
	pos *= d;	
	pos += Nodo[w];
	
	return pos;

}


// Modos:
//
// 0 - Normal: Salta indemdiatamente del ultimo nodo al primero.
// 1 - Loop(bucle): Hace transicion del ultimo nodo al primero.
// 2 - PingPong: Hace transiciones del ultimo nodo al primero pasando por nodos intermedios.


function Posicion(distancia : float) {

	return Posicion(distancia,1);

}

function Posicion(distancia : float, modo : int) : Vector3 {

	if (nNodo == 0) return Vector3.zero;
	if (nNodo == 1) return Nodo[0];
	
	switch (modo) {
	
		case 1:
		
			return RutaBucle(distancia % dBucle);
			break;
			
		case 2:
		
			return RutaPingPong(distancia);
			break;
			
		default:
		
			if (distancia > dRuta) distancia = dRuta;
			return RutaUnaVez(distancia);			
	
	}

}

function GetdRuta() : float {

	return dRuta;

}

function GetdBucle() : float {

	return dBucle;

}