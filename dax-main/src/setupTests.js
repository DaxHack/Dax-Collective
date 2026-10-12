// CRA's Jest 27/JSDOM lacks the encoding globals used by React Router 7.
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
