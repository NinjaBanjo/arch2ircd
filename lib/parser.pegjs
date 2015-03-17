start
  = message

message
  = ":" prefix: prefix "\x20" command: $ command ? params:( params ) ? CRLF { return {prefix:prefix, command: command, params: params }}
  / CRLF

prefix
  = nickname: $ nickname "!" user: $ user "@" host: $ host {return {nickname: nickname, user: user, host: host} } 
  / servername: $ servername { return { servername: servername }}
    
command
  = letter+ / digit+

params
  =  ($ ("\x20" middle) { return text().slice(1) })+ ( ("\x20" ":" trailing ) { return text().slice(2) }) ?
  /   ($ ("\x20" middle) { return text().slice(1) })+ ( ("\x20" ":"? trailing) { return text().slice(2) }) ?

middle 
  = nospcrlfcl (":" / nospcrlfcl)*

trailing 
  = (":" / "\x20" / nospcrlfcl)*

nospcrlfcl
 = [\x01-\x09] / [\x0B-\x0C] / [\x0E-\x1F] / [\x21-\x39] / [\x3B-\xFF]

servername
  = hostname

host 
  = hostname / hostaddr 

hostname
  = shortname ("." shortname)* 

shortname 
  = (letter / digit ) (letter / digit / "-")*

user
  = ( special ) ? nickname

hostaddr
  = ip4addr

ip4addr 
  = digit+ "." digit+ "." digit+ "." digit+

nickname 
= ( special / letter ) (letter / digit / special)+

special
  = '~' / '-' / '_' / '|' / '[' / ']' / '{' / '}'

CRLF
  = "\x0D" "\x0A"

digit
  = [0-9]

letter
  = [a-z] / [A-Z]