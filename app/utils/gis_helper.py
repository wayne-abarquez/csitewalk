from sqlalchemy import func
from geoalchemy2.shape import to_shape


class GISHelper:
    @staticmethod
    def bounds_to_box(bounds):
        points = bounds.split(',')

        if len(points) < 4:
            return None

        box = 'BOX(' + points[1] + ' ' + points[0] + ',' + \
              points[3] + ' ' + points[2] + ')'

        return box

    @staticmethod
    def make_bound_box(box):
        return func.ST_Envelope(
            func.box2d(box),
            srid=4326)

    @staticmethod
    def point_to_latlng_dict(value):
        """
        Convert PostGIS POINT Geometry to {lat=pt.y,lng=pt.x}
        """
        point = to_shape(value)
        return dict(lat=point.y, lng=point.x)
