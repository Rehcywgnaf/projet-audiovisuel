import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';
import DriveTestService from '@/services/drive/DriveTestService';

[... reste du code DriveTestExecutor ...]