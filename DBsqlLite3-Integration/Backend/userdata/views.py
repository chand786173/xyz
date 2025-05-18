from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserData
from .serializers import UserDataSerializer

@api_view(['GET', 'POST'])
def store_user_data(request):
    if request.method == 'POST':
        serializer = UserDataSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data.get('consent'):
                serializer.save()
                return Response({"message": "Data saved with consent"}, status=201)
            else:
                return Response({"error": "Consent not given"}, status=403)
        return Response(serializer.errors, status=400)

    elif request.method == 'GET':
        users = UserData.objects.all()
        serializer = UserDataSerializer(users, many=True)
        return Response(serializer.data)
    