
# http://gameprogrammer.com/fractal.html

namespace eval ::diamond {
    set H 0.5
}


proc ::diamond::appy {surface} {
    variable H
    
    

    set finish 0
    while {$finish == 0} {
    
        set TopLeft [lindex $]
    
        # On calcul la nouvelle valeur de H
        set H [expr H * pow(2,H)]
    }
    
}

proc ::diamond::divide {size} {
  var x, y, half = size / 2;
  var scale = roughness * size;
  if (half < 1) return;

  for (y = half; y < self.max; y += size) {
    for (x = half; x < self.max; x += size) {
      square(x, y, half, Math.random() * scale * 2 - scale);
    }
  }
  
  for (y = 0; y <= self.max; y += half) {
    for (x = (y + half) % size; x <= self.max; x += size) {
      diamond(x, y, half, Math.random() * scale * 2 - scale);
    }
  }
  
  divide(size / 2);
}

proc ::diamond::diamond {x, y, size, offset} {
  var ave = average([
    self.get(x, y - size),      // top
    self.get(x + size, y),      // right
    self.get(x, y + size),      // bottom
    self.get(x - size, y)       // left
  ]);
  self.set(x, y, ave + offset);
}

function square(x, y, size, offset) {
  var ave = average([
    self.get(x - size, y - size),   // upper left
    self.get(x + size, y - size),   // upper right
    self.get(x + size, y + size),   // lower right
    self.get(x - size, y + size)    // lower left
  ]);
  self.set(x, y, ave + offset);
}
