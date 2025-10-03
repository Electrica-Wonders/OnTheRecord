# On the Record 
A super simple locally hosted site which allows users to search for set (DJ mix) by searching for an artist, genre or both! Site uses a public API (https://api.mixcloud.com)
### The fetch, rank and render [findSets()]
Reads the search key and fetches (<25 items as limit) from the API. Then ranks and picks the top by time (sets >45 minutes and plays), keeps top 5 entries.
HTML cards are then rendered to show name, uploaders' name, minutes (approx as auio_length/60), plays and link. Returns a small html snip for each results.

Hope you enjoy this simple script and a bit of listening!
