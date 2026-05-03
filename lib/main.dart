
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eventos Cercanos',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MapScreen(),
    );
  }
}

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  LatLng? _currentPosition;
  bool _isLoading = true;
  List<Marker> _markers = [];
  final String _ticketmasterApiKey = 'APIKEY'; // aca va la api key de ticket master

  @override
  void initState() {
    super.initState();
    _getLocation();
  }

  Future<void> _getLocation() async {
    var status = await Permission.location.request();
    if (status.isGranted) {
      try {
        Position position = await Geolocator.getCurrentPosition(
            desiredAccuracy: LocationAccuracy.high);
        setState(() {
          _currentPosition = LatLng(position.latitude, position.longitude);
          _getEvents();
          _isLoading = false;
        });
      } catch (e) {
        print(e);
        setState(() {
          _isLoading = false;
        });
      }
    } else {
      // Handle permission denial
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _getEvents() async {
    if (_currentPosition == null) return;

    final String url =
        'https://app.ticketmaster.com/discovery/v2/events.json?apikey=$_ticketmasterApiKey&latlong=${_currentPosition!.latitude},${_currentPosition!.longitude}&radius=10';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['_embedded'] != null) {
          final events = data['_embedded']['events'];
          _updateMarkers(events);
        }
      } else {
        throw Exception('Failed to load events');
      }
    } catch (e) {
      print(e);
    }
  }

  void _updateMarkers(List<dynamic> events) {
    List<Marker> markers = [];
    if (_currentPosition != null) {
      markers.add(
        Marker(
          width: 80.0,
          height: 80.0,
          point: _currentPosition!,
          builder: (ctx) => const Icon(
            Icons.person_pin,
            color: Colors.blue,
            size: 40,
          ),
        ),
      );
    }
    for (var event in events) {
      final venue = event['_embedded']['venues'][0];
      final location = venue['location'];
      if (location != null &&
          location['latitude'] != null &&
          location['longitude'] != null) {
        final lat = double.parse(location['latitude']);
        final lon = double.parse(location['longitude']);
        markers.add(
          Marker(
            width: 80.0,
            height: 80.0,
            point: LatLng(lat, lon),
            builder: (ctx) => IconButton(
              icon: const Icon(
                Icons.location_on,
                color: Colors.red,
                size: 40,
              ),
              onPressed: () {
                _showEventDetails(event);
              },
            ),
          ),
        );
      }
    }
    setState(() {
      _markers = markers;
    });
  }

  void _showEventDetails(dynamic event) {
    final eventName = event['name'];
    final venueName = event['_embedded']['venues'][0]['name'];
    final eventDate = event['dates']['start']['localDate'];
    final eventTime = event['dates']['start']['localTime'];
    final eventStatus = event['dates']['status']['code'];
    final eventUrl = event['url'];

    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                eventName,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text('Venue: $venueName'),
              const SizedBox(height: 8),
              Text('Date: $eventDate'),
              const SizedBox(height: 8),
              Text('Time: $eventTime'),
              const SizedBox(height: 8),
              Text('Status: $eventStatus'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  _launchURL(eventUrl);
                },
                child: const Text('More Info'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _launchURL(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eventos Cercanos'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _currentPosition == null
              ? const Center(child: Text('Could not get location'))
              : FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    center: _currentPosition,
                    zoom: 13.0,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                      subdomains: const ['a', 'b', 'c'],
                    ),
                    MarkerLayer(markers: _markers),
                  ],
                ),
    );
  }
}

