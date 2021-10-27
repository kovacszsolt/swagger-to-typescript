# Swagger to Typescript

Generate Typescript enums, interfaces and models from Swagger JSON output.  

## usage

npx swagger-to-typescript [parameters]

## parameters

--ip, --inputpath             Swagger input file path           [required]  
-d, --debug                       Debug enable - temporarily file: debug.json
[default: true]  
--pt, --purgetarget           Purge target directory       [default: false]  
--pe, --pathenum              Enum file path  
--pi, --pathinterface         Interface file path  
--pm, --pathmodel             Single Path  
--pmo, --pathmock             Mock file path  
--pes, --pathenumsymbol       Enum symbol  
--pis, --pathinterfacesymbol  Interface symbol  
--pms, --pathmodelsymbol      Model symbol  
--pmos, --pathmocksymbol      Mock symbol  
--mc, --mongoconnection       MongoDB connection string  
--ns, --namespace             Namespace will remove  
--mcol, --mongocollection     MongoDB Collection Name  
--gall, --generateall         Generate all interface and enums  
--ct, --comparetype           Compare type mongo|json  
--cjs, --comparejsonsave      Compare type json save result [default: false]  
--tu, --teamsurl              Microsoft Teams webhook URL    [default: ""]  
-h                                Show help                          [boolean]  
--tt, --teamstitle            Microsoft Teams message Title  
