import { serve } from "https://deno.land/std@0.146.0/http/server.ts";
import { Diplodocus } from "https://deno.land/x/diplodocus@0.0.3/mod.ts";

const diplodocus = await Diplodocus.load();
await serve((request) => diplodocus.handler(request));